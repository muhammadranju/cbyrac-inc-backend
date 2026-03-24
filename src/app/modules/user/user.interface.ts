import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
export enum EMPLOYEE_ROLES {
  INTERN = 'Fit2Lead Intern',
  TEMPORARY = 'Temporary Employee',
  ADMINISTRATOR = 'Administrator',
}
export enum EMPLOYEE_STUTUS {
  PENDING = 'pending',
  APPROVE = 'approve',
  REJECT = 'reject',
}

export type IUser = {
  firstName: string;
  lastName: string;
  role: USER_ROLES;
  employee_role: EMPLOYEE_ROLES;
  contact: string;
  email: string;
  password: string;
  employee_status: EMPLOYEE_STUTUS;
  location: string;
  image?: string;
  status: 'active' | 'delete';
  verified?: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;

export interface ISearchParams {
  firstName?: string;
  lastName?: string;
}
