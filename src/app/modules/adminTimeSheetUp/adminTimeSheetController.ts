import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getMultipleFilesPaths } from '../../../shared/getFilePath';
import AdminTimeSheetService from './adminTimeSheetService';

class AdminTimeSheetController {
  createTimeSheet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPaths(req.files, 'image');
      console.log(images);
      if (!images || images.length === 0) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'No images uploaded',
        });
      }

      const calendar = await AdminTimeSheetService.createAdminTimeSheet({
        image: images,
      });

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Calendar created successfully',
        data: calendar,
      });
    }
  );

  getAllTimeSheet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendars = await AdminTimeSheetService.getAllAdminTimeSheet();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Calendars fetched successfully',
        data: calendars,
      });
    }
  );

  getByIdTimeSheet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminTimeSheetService.getAdminTimeSheetById(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Calendar not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Calendar fetched successfully',
        data: calendar,
      });
    }
  );

  updateTimeSheet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const image = getMultipleFilesPaths(req.files, 'image');
      const calendar = await AdminTimeSheetService.updateAdminTimeSheet(
        req.params.id,
        {
          image,
        }
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Calendar not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Calendar updated successfully',
        data: calendar,
      });
    }
  );

  deleteTimeSheet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await AdminTimeSheetService.deleteAdminTimeSheet(
        req.params.id
      );

      if (!calendar) {
        sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Calendar not found',
          data: null,
        });
        return;
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Calendar deleted successfully',
        data: calendar,
      });
    }
  );
}

export default new AdminTimeSheetController();
