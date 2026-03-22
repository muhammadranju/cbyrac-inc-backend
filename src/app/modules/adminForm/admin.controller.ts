import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminFormService } from './admin.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

// ✅ Create Admin Form
const createAdminForm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const image = getSingleFilePath(req.files, 'image');
      // console.log(req.files);
      const image = `/image/${req.body.image}`;
      const formData = {
        ...req.body,
        receivedBy: image,
      };
      console.log(formData);
      const result = await AdminFormService.createAdminForm(formData);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Admin Form created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Get All Admin Forms
const getAllAdminForms = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AdminFormService.getAllAdminForms();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin Forms fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Get Single Admin Form
const getAdminFormById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await AdminFormService.getAdminFormById(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin Form fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Update Admin Form
const updateAdminForm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      let image;

      // Handle file upload (if provided)
      if (req.files) {
        image = getSingleFilePath(req.files, 'image');
      }

      // Prepare payload
      const payload = {
        ...req.body,
        ...(image && { receivedBy: image }), // Only include if image exists
      };

      const result = await AdminFormService.updateAdminForm(id, payload);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin Form updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Delete Admin Form
const deleteAdminForm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await AdminFormService.deleteAdminForm(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin Form deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const AdminFormController = {
  createAdminForm,
  getAllAdminForms,
  getAdminFormById,
  updateAdminForm,
  deleteAdminForm,
};
