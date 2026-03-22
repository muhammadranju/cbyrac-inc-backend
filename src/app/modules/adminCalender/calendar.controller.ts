import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CalendarService from './calendar.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  getMultipleFilesPath,
  getMultipleFilesPaths,
  getSingleFilePath,
} from '../../../shared/getFilePath';

class CalendarController {
  create = catchAsync(
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

      const calendar = await CalendarService.createCalendar({
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

  getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendars = await CalendarService.getAllCalendars();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Calendars fetched successfully',
        data: calendars,
      });
    }
  );

  getById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await CalendarService.getCalendarById(req.params.id);

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

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const image = getMultipleFilesPaths(req.files, 'image');
      const calendar = await CalendarService.updateCalendar(req.params.id, {
        image,
      });

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

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const calendar = await CalendarService.deleteCalendar(req.params.id);

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

export default new CalendarController();
