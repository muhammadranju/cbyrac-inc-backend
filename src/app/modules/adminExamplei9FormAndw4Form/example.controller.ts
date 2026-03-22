import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getMultipleFilesPaths } from '../../../shared/getFilePath';
import AdminI9FormAndW4FormExampleService from './example.service';

class AdminI9FormAndW4FormExampleController {
  /**
   * Create I9 Form
   */
  createI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPaths(req.files, 'image');

      if (!images || images.length === 0) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'No images uploaded',
        });
      }

      const result = await AdminI9FormAndW4FormExampleService.createAdminI9Form(
        {
          image: images,
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'I9 Form created successfully',
        data: result,
      });
    }
  );

  /**
   * Get Latest I9 Form
   */
  getLatestI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await AdminI9FormAndW4FormExampleService.getLatestI9Form();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Latest I9 Form fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Create W4 Form
   */
  createW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPaths(req.files, 'image');

      if (!images || images.length === 0) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'No images uploaded',
        });
      }

      const result = await AdminI9FormAndW4FormExampleService.createAdminW4Form(
        {
          image: images,
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'W4 Form created successfully',
        data: result,
      });
    }
  );

  /**
   * Get Latest W4 Form
   */
  getLatestW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await AdminI9FormAndW4FormExampleService.getLatestW4Form();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Latest W4 Form fetched successfully',
        data: result,
      });
    }
  );
}

export default new AdminI9FormAndW4FormExampleController();
