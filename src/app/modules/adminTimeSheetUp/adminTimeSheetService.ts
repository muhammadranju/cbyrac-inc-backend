import { IAdminTimeSheet } from './adminTimesheetInterface';
import AdminTimeSheetModel from './adminTimeSheetmodel';

class AdminTimeSheetService {
  // Create new calendar entry
  async createAdminTimeSheet(
    payload: IAdminTimeSheet
  ): Promise<IAdminTimeSheet> {
    const calendar = new AdminTimeSheetModel(payload);
    return calendar.save();
  }

  // Get all calendar entries
  async getAllAdminTimeSheet(): Promise<IAdminTimeSheet | null> {
    return AdminTimeSheetModel.findOne().sort({ createdAt: -1 });
  }

  // Get calendar by ID
  async getAdminTimeSheetById(id: string): Promise<IAdminTimeSheet | null> {
    return AdminTimeSheetModel.findById(id);
  }

  // Delete calendar by ID
  async deleteAdminTimeSheet(id: string): Promise<IAdminTimeSheet | null> {
    return AdminTimeSheetModel.findByIdAndDelete(id);
  }

  // Update calendar by ID
  async updateAdminTimeSheet(
    id: string,
    data: Partial<IAdminTimeSheet>
  ): Promise<IAdminTimeSheet | null> {
    return AdminTimeSheetModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new AdminTimeSheetService();
