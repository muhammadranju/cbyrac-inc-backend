import { EMPLOYEE_ROLES } from '../app/modules/user/user.interface';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  firstName: 'Deniel',
  lastName: 'dev',
  email: config.super_admin.email,
  role: USER_ROLES.SUPER_ADMIN,
  employee_role: EMPLOYEE_ROLES.ADMINISTRATOR,
  password: config.super_admin.password,
  verified: true,
};

export const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    email: config.super_admin.email,
    role: USER_ROLES.SUPER_ADMIN,
  });
  if (!isExistSuperAdmin) {
    await User.create(payload);
    logger.info('✨ Super Admin account has been successfully created!');
  }
};
