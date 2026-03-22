import { ICalendar } from './calendar.interface';
import CalendarModel from './calendar.model';

class CalendarService {
  // Create new calendar entry
  async createCalendar(payload: ICalendar): Promise<ICalendar> {
    const calendar = new CalendarModel(payload);
    return calendar.save();
  }

  // Get all calendar entries
  async getAllCalendars(): Promise<ICalendar | null> {
    return CalendarModel.findOne().sort({ createdAt: -1 });
  }

  // Get calendar by ID
  async getCalendarById(id: string): Promise<ICalendar | null> {
    return CalendarModel.findById(id);
  }

  // Delete calendar by ID
  async deleteCalendar(id: string): Promise<ICalendar | null> {
    return CalendarModel.findByIdAndDelete(id);
  }

  // Update calendar by ID
  async updateCalendar(
    id: string,
    data: Partial<ICalendar>
  ): Promise<ICalendar | null> {
    return CalendarModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new CalendarService();
