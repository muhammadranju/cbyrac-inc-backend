import mongoose, { Schema, Document } from 'mongoose';
import { CHECK_ONE, JOB_STATUS, PAY_RATE, IAdminForm } from './admin.interface';

export interface IAdminFormDocument extends IAdminForm, Document {}

const AdminFormSchema = new Schema<IAdminFormDocument>(
  {
    checkOne: {
      type: String,
      enum: Object.values(CHECK_ONE),
      required: true,
    },
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    wcCode: {
      type: String,
      required: true,
      trim: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    terminateDate: {
      type: Date,
      default: null,
    },
    payRate: {
      type: String,
      enum: Object.values(PAY_RATE),
      required: true,
    },
    salaryAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    regularRateSalary: {
      type: Number,
      min: 0,
      default: null,
    },
    otRate: {
      type: Number,
      min: 0,
      default: null,
    },
    workHoursPerPeriod: {
      type: Number,
      min: 0,
      default: null,
    },
    receivedBy: {
      type: String,
      required: true, // file name, image, or PDF path
    },
    receivedDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminFormModel = mongoose.model<IAdminFormDocument>(
  'AdminForm',
  AdminFormSchema
);
