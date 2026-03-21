import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  getMultipleFilesPaths,
  getSingleFile,
} from '../../../shared/getFilePath';
import AdminI9FormAndW4FormService from './service';

class AdminI9FormAndW4FormController {
  createI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPaths(req.files, 'image');
      const example = getSingleFile(req.files, 'example');
      console.log(images);
      if (!images || images.length === 0) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'No images uploaded',
        });
      }

      const calendar = await AdminI9FormAndW4FormService.createAdminI9Form({
        image: images,
        example,
      });

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'I9Form created successfully',
        data: calendar,
      });
    }
  );

  createW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPaths(req.files, 'image');
      const example = getSingleFile(req.files, 'example');
      console.log(images);
      if (!images || images.length === 0) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'No images uploaded',
        });
      }

      const calendar = await AdminI9FormAndW4FormService.createAdminW4Form({
        image: images,
        example,
      });

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'W4form created successfully',
        data: calendar,
      });
    }
  );

  getAllI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendars = await AdminI9FormAndW4FormService.getAllAdminI9Form();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'I9Form fetched successfully',
        data: calendars,
      });
    }
  );

  getAllW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendars = await AdminI9FormAndW4FormService.getAllAdminW4Form();
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'W4Form fetched successfully',
        data: calendars,
      });
    }
  );

  getByIdI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminI9FormAndW4FormService.getAdminI9FormById(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'I9 Form not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'I9Form fetched successfully',
        data: calendar,
      });
    }
  );

  getByIdW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminI9FormAndW4FormService.getAdminW4FormById(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'W4Form Form not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'W4Form fetched successfully',
        data: calendar,
      });
    }
  );

  updateI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const image = getMultipleFilesPaths(req.files, 'image');
      const calendar = await AdminI9FormAndW4FormService.updateAdminI9Form(
        req.params.id,
        {
          image,
        }
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'I9FOrm not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'I9Form updated successfully',
        data: calendar,
      });
    }
  );

  updateW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const image = getMultipleFilesPaths(req.files, 'image');
      const calendar = await AdminI9FormAndW4FormService.updateAdminW4Form(
        req.params.id,
        {
          image,
        }
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'W4Form not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'W4Form updated successfully',
        data: calendar,
      });
    }
  );

  deleteI9Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminI9FormAndW4FormService.deleteAdminI9Form(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'I9Form not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'I9Form deleted successfully',
        data: calendar,
      });
    }
  );

  deleteW4Form = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminI9FormAndW4FormService.deleteAdminW4Form(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'W4Form not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'W4Form deleted successfully',
        data: calendar,
      });
    }
  );
}

export default new AdminI9FormAndW4FormController();
