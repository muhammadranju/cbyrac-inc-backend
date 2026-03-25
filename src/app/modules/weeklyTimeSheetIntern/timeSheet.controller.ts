import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WeeklyDetailsService } from './timeSheet.service';
import {
  getAllUploadedFiles,
  IFolderName,
  parseNestedFormData,
} from '../../../shared/getFilePath';
import { IWeeklyTimeSheet } from './timeSheet.interface';

const createWeeklyDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadedFilesRaw = getAllUploadedFiles(req.files);
    const uploadedFiles = Object.fromEntries(
      Object.entries(uploadedFilesRaw).filter(([_, v]) => v !== undefined)
    ) as Record<IFolderName, string>;
    const data = {
      ...req.body,
      timeSheetPdfOrImage: uploadedFiles.timeSheetPdfOrImage,
      employeeSignature: uploadedFiles.employeeSignature1,
    };
    const result = await WeeklyDetailsService.createWeeklyDetails(
      data as IWeeklyTimeSheet
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Weekly details created successfully',
      data: result,
    });
  }
);

const getAllWeeklyDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await WeeklyDetailsService.getAllWeeklyDetails();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Weekly details fetched successfully',
    data: result,
  });
});

const getWeeklyDetailsById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WeeklyDetailsService.getWeeklyDetailsById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Weekly detail fetched successfully',
    data: result,
  });
});

const updateWeeklyDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const uploadedFilesRaw = getAllUploadedFiles(req.files);
  const uploadedFiles = Object.fromEntries(
    Object.entries(uploadedFilesRaw).filter(([_, v]) => v !== undefined)
  ) as Record<IFolderName, string>;
  const data = {
    ...req.body,
    timeSheetPdfOrImage:
      uploadedFiles?.timeSheetPdfOrImage || req.body.timeSheetPdfOrImage,
    employeeSignature:
      uploadedFiles?.employeeSignature1 || req.body.employeeSignature,
  };
  const result = await WeeklyDetailsService.updateWeeklyDetails(id, data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Weekly details updated successfully',
    data: result,
  });
});

const deleteWeeklyDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await WeeklyDetailsService.deleteWeeklyDetails(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Weekly details deleted successfully',
      data: result,
    });
  }
);

export const WeeklyDetailsController = {
  createWeeklyDetails,
  getAllWeeklyDetails,
  getWeeklyDetailsById,
  updateWeeklyDetails,
  deleteWeeklyDetails,
};
