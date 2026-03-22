import mongoose, { Schema } from 'mongoose';
import { ICalendar } from './calendar.interface';

const CalendarSchema: Schema = new Schema(
  {
    image: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const CalendarModel = mongoose.model<ICalendar>(
  'Admin_Calendar',
  CalendarSchema
);
export default CalendarModel;
