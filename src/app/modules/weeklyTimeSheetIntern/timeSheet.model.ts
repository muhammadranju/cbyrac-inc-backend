import { model, Schema } from 'mongoose';
import { IWeeklyTimeSheet } from './timeSheet.interface';

const WeeklyTimeSheetSchema = new Schema<IWeeklyTimeSheet>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    departmentName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    supervisorEmail: { type: String, required: true },
    supervisorPhone: { type: String, required: true },
    timeSheetPdfOrImage: { type: String, required: true },
    employeeSignature: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const WeeklyTimeSheetModel = model<IWeeklyTimeSheet>(
  'TimeSheetIntern',
  WeeklyTimeSheetSchema
);
