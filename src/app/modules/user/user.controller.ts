import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
// create user ..
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);
// get the user or admin Login profile..

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

//filter the employyee by the role.

const employeeFilter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employee_role, page = '1', limit = '10' } = req.query;

      // Validate employee_role
      if (!employee_role || typeof employee_role !== 'string') {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'employee_role query parameter is required',
        });
      }

      // Convert page/limit safely
      const pageNumber = Math.max(parseInt(page as string, 10), 1);
      const limitNumber = Math.max(parseInt(limit as string, 10), 1);

      const result = await UserService.filterEmployeesByRole(
        employee_role,
        pageNumber,
        limitNumber
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Employees with role ${employee_role} fetched successfully`,
        data: result.data,
        pagination: result.meta, // includes pagination info
      });
    } catch (err) {
      next(err);
    }
  }
);

// Search the employye from the database,,,,
const searchEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = req.query;

    if (
      (!firstName || typeof firstName !== 'string') &&
      (!lastName || typeof lastName !== 'string')
    ) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'At least firstName or lastName query parameter is required',
      });
    }

    const result = await UserService.searchEmployees({
      firstName: typeof firstName === 'string' ? firstName : undefined,
      lastName: typeof lastName === 'string' ? lastName : undefined,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Employees fetched successfully',
      data: result,
    });
  }
);
// give the User Statistical data ..
const getUserStatistics = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('data');
    const result = await UserService.getUserStats();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User statistics fetched successfully',
      data: result,
    });
  }
);
// filter by year...
const getYearlyUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();

    const result = await UserService.getYearlyUserStats(year);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User statistics for year ${year} fetched successfully`,
      data: result,
    });
  }
);

//update the employee status..
const changeEmployeeStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await UserService.updateEmployeeStatus(id, status);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Employee status update successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  employeeFilter,
  searchEmployee,
  getUserStatistics,
  getYearlyUserStats,
  changeEmployeeStatus,
};
