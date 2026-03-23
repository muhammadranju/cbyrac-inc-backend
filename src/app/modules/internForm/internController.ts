import { Request, Response, NextFunction } from 'express';
import { InternService } from './internService';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getSingleFile } from '../../../shared/getFilePath';
import { IInternFormData } from './interface';
import { convertToNestedObject } from '../../../helpers/convertToNestedObject';
import { generateHTMLTemplate } from './internPdf';
import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();
// Create Intern

const createIntern = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const nestedBody = convertToNestedObject(req.body);
  const signature = getSingleFile(req.files, 'signature');
  const accountFile = getSingleFile(req.files, 'accountFile');
  const i9Form = getSingleFile(req.files, 'i9Form');
  const w4Form = getSingleFile(req.files, 'w4Form');
  const residentCard = getSingleFile(req.files, 'residentCard');
  const socialSecurityCard = getSingleFile(req.files, 'socialSecurityCard');
  const photoId = getSingleFile(req.files, 'photoId');
  const workAuthorizationDocument = getSingleFile(
    req.files,
    'workAuthorizationDocument'
  );

  const bodyData: any = { ...nestedBody };

  if (signature) bodyData.signature = signature;
  if (accountFile) bodyData.accountFile = accountFile;
  if (residentCard) bodyData.residentCard = residentCard;
  if (photoId) bodyData.photoId = photoId;
  if (socialSecurityCard) bodyData.socialSecurityCard = socialSecurityCard;
  if (workAuthorizationDocument)
    bodyData.workAuthorizationDocument = workAuthorizationDocument;
  if (i9Form) bodyData.i9Form = i9Form;
  if (w4Form) bodyData.w4Form = w4Form;

  // Save intern
  if (
    !bodyData.generalInfo ||
    !bodyData.bankForm ||
    !bodyData.i9Form ||
    !bodyData.w4Form ||
    !bodyData.citizenShipForm
  ) {
    console.error('Invalid intern data:', bodyData);
    throw new Error('Invalid form submission');
  }
  bodyData.userId = userId;
  const email: string | undefined = process.env.SUPER_ADMIN_EMAIL;

  const intern = await InternService.createIntern(
    bodyData as IInternFormData,
    email,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Intern created successfully',
    data: intern,
  });
});

const getAllInterns = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const interns = await InternService.getAllIntern(userId);
  console.log(interns);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Interns fetched successfully',
    data: interns,
  });
});

// Get Intern by ID
const getIntern = catchAsync(async (req: Request, res: Response) => {
  const intern = await InternService.getInternById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Intern fetched successfully',
    data: intern,
  });
});

// Update Intern
// const updateIntern = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   // Parse nested form fields
//   const bodyData = parseNestedFormData(req.body);
//   const uploadedFilesRaw = getAllUploadedFiles(req.files);
//   const uploadedFiles = Object.fromEntries(
//     Object.entries(uploadedFilesRaw).filter(([_, v]) => v !== undefined)
//   ) as Record<IFolderName, string>;

//   // Update intern in DB
//   const updatedIntern = await InternService.updateIntern(
//     id,
//     bodyData as Partial<IInternFormData>,
//     uploadedFiles
//   );
//   if (!updatedIntern) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       "Intern Form Data doesn't update successfully!"
//     );
//   }
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Intern updated successfully',
//     data: updatedIntern,
//   });
// });

// Delete Intern
const deleteIntern = catchAsync(async (req: Request, res: Response) => {
  const intern = await InternService.deleteIntern(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Intern deleted successfully',
    data: intern,
  });
});

// const sendMailToAdmin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const email = process.env.SUPER_ADMIN_EMAIL;

//     // Check if file exists
//     if (!req.file) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'No PDF file uploaded',
//       });
//     }

//     const pdfBuffer = req.file.buffer;

//     try {
//       const result = await InternService.SendPdfByMail(email, pdfBuffer);
//       sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         data: 'PDF sent to admin successfully',
//       });
//     } catch (err) {
//       next(err); // pass the error to global error handler
//     }
//   }
// );

// Wrapper for async error handling

// ==========================================
// File: internPdfController.ts
// ==========================================

// Wrapper for async error handling

const catchAsyncFun = (fn: Function) => {
  return (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const GenerateInternPdf = catchAsyncFun(
  async (req: Request, res: Response) => {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      console.log('=== PDF Generation Started ===');

      // Get user ID
      const userId = req.params.id;
      if (!userId) {
        console.error('No user ID found');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      console.log('User ID:', userId);

      // Fetch employee data
      const employeeData = await InternService.getInternDataForPdf(userId);

      if (!employeeData) {
        console.error('No employee data found');
        return res.status(404).json({
          error: 'Employee data not found',
          message: 'No intern data available for this user',
        });
      }

      console.log('Employee data retrieved successfully');
      console.log(
        'Employee name:',
        employeeData.generalInfo?.firstName,
        employeeData.generalInfo?.lastName
      );

      // Launch browser
      console.log('Launching Puppeteer browser...');
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      console.log('Browser launched successfully');

      // Create new page
      page = await browser.newPage();
      console.log('New page created');

      // Set viewport
      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      // Generate HTML
      console.log('Generating HTML template...');
      const htmlContent = generateHTMLTemplate(employeeData);
      console.log('HTML template generated, length:', htmlContent.length);

      // Set content
      console.log('Setting page content...');
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      console.log('Page content set successfully');

      // Wait for any images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate PDF
      console.log('Generating PDF...');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      });

      console.log('PDF generated successfully');
      console.log('PDF buffer length:', pdfBuffer.length);
      console.log('PDF buffer type:', typeof pdfBuffer);
      console.log('Is Buffer:', Buffer.isBuffer(pdfBuffer));

      // Close browser BEFORE sending response
      console.log('Closing browser...');
      await page.close();
      await browser.close();
      browser = null;
      page = null;
      console.log('Browser closed');

      // Verify buffer is valid
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error('Generated PDF buffer is empty');
      }

      // Create filename
      const timestamp = new Date().toISOString().split('T')[0];
      const lastName = employeeData.generalInfo?.lastName || 'employee';
      const filename = `${lastName}-intern-form-${timestamp}.pdf`;

      console.log('Filename:', filename);
      console.log('Sending PDF response...');

      // Clear any existing headers
      res.removeHeader('Content-Encoding');

      // Set headers
      res.status(200);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');

      // Send the buffer
      res.end(pdfBuffer, 'binary');

      console.log('=== PDF sent successfully ===');
    } catch (error) {
      console.error('=== ERROR in PDF Generation ===');
      console.error('Error:', error);

      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      // Cleanup browser if still open
      try {
        if (page) await page.close();
        if (browser) await browser.close();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          error: 'Failed to generate PDF',
          message: error instanceof Error ? error.message : 'Unknown error',
          details:
            process.env.NODE_ENV === 'development'
              ? error instanceof Error
                ? error.stack
                : String(error)
              : undefined,
        });
      }
    }
  }
);

export const InternController = {
  createIntern,
  getAllInterns,
  getIntern,
  // updateIntern,
  deleteIntern,
  // sendMailToAdmin,
};
