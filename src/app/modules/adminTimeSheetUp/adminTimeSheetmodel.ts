import mongoose, { Schema } from 'mongoose';
import { IAdminTimeSheet } from './adminTimesheetInterface';

const adminTimeSheetSchema: Schema = new Schema(
  {
    image: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const AdminTimeSheetModel = mongoose.model<IAdminTimeSheet>(
  'Admin_Time_Sheet',
  adminTimeSheetSchema
);
export default AdminTimeSheetModel;
