import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { ISearchParams } from './user.interface';
import { paginateQuery } from '../../../util/pagination';
//create User
const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.USER;
  console.log(payload);
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.firstName + createUser.lastName,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};
// get User Profile
const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};
//Update the user profile..
const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// filter the user with Intern and Temporary..
const filterEmployeesByRole = async (
  employee_role: string,
  page: number,
  limit: number
) => {
  const projection = 'firstName lastName email';
  return paginateQuery(User, { employee_role }, page, limit, projection);
};

//search the user with first name and last name or both,,,
const searchEmployees = async ({ firstName, lastName }: ISearchParams) => {
  const query: any = {};

  if (firstName) {
    query.firstName = { $regex: firstName, $options: 'i' };
  }

  if (lastName) {
    query.lastName = { $regex: lastName, $options: 'i' };
  }

  // If both firstName and lastName are provided, match both
  const employees = await User.find(query);
  return employees;
};

// provide the user statistical data ...
const getUserStats = async () => {
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Helper to calculate percentage safely
  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return 100;
    if (previous === 0 && current === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  // Define reusable query conditions
  const baseFilter = { role: { $ne: 'SUPER_ADMIN' } };
  const lastMonthRange = {
    createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
  };

  // Run all DB operations in parallel for performance
  const [
    totalUsers,
    lastMonthUsers,
    totalIntern,
    lastMonthIntern,
    totalTemporary,
    lastMonthTemporary,
  ] = await Promise.all([
    User.countDocuments(baseFilter),
    User.countDocuments({ ...baseFilter, ...lastMonthRange }),
    User.countDocuments({ employee_role: 'Fit2Lead Intern' }),
    User.countDocuments({
      employee_role: 'Fit2Lead Intern',
      ...lastMonthRange,
    }),
    User.countDocuments({ employee_role: 'Temporary Employee' }),
    User.countDocuments({
      employee_role: 'Temporary Employee',
      ...lastMonthRange,
    }),
  ]);

  // Calculate all percentages
  const totalUsersPercentage = calculatePercentage(totalUsers, lastMonthUsers);
  const internUsersPercentage = calculatePercentage(
    totalIntern,
    lastMonthIntern
  );
  const temporaryUsersPercentage = calculatePercentage(
    totalTemporary,
    lastMonthTemporary
  );

  // Return a clean response object
  return [
    { totalUsers, totalUsersPercentage },
    { totalIntern, internUsersPercentage },
    {
      totalTemporary,
      temporaryUsersPercentage,
    },
  ];
};

//provide yearly data..
const getYearlyUserStats = async (year: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // +1 because months are 0-indexed
  const isCurrentYear = year === currentYear;

  // Define time range for the given year
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  // Aggregate once — MongoDB handles the grouping efficiently
  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lt: endOfYear },
        employee_role: { $in: ['Fit2Lead Intern', 'Temporary Employee'] },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          role: '$employee_role',
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Month names
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Initialize array only up to current month (if current year)
  const validMonths = isCurrentYear ? months.slice(0, currentMonth) : months;

  const data = validMonths.map(month => ({
    month,
    intern: 0,
    temporary: 0,
  }));

  // Fill actual data
  stats.forEach(({ _id, count }) => {
    const { month, role } = _id;
    if (!isCurrentYear || month <= currentMonth) {
      const monthIndex = month - 1;
      if (role === 'Fit2Lead Intern') data[monthIndex].intern = count;
      if (role === 'Temporary Employee') data[monthIndex].temporary = count;
    }
  });

  return data;
};

// update the employee status..
const updateEmployeeStatus = async (userId: string, status: string) => {
  // Make sure status is valid enum
  const validStatuses = ['pending', 'approve', 'reject'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { employee_status: status },
    { new: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  filterEmployeesByRole,
  searchEmployees,
  getUserStats,
  getYearlyUserStats,
  updateEmployeeStatus,
};
