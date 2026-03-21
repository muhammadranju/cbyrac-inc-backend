import { II9form, IW4Form } from './interface';
import { I9FormModel, W4FormModel } from './model';

class AdminI9FormAndW4FormService {
  // Create new calendar entry
  async createAdminI9Form(payload: II9form): Promise<II9form> {
    const calendar = new I9FormModel(payload);
    return calendar.save();
  }

  async createAdminW4Form(payload: IW4Form): Promise<IW4Form> {
    const calendar = new W4FormModel(payload);
    return calendar.save();
  }

  // Get all calendar entries
  async getAllAdminI9Form(): Promise<II9form | null> {
    return I9FormModel.findOne().sort({ createdAt: -1 });
  }

  async getAllAdminW4Form(): Promise<IW4Form | null> {
    return W4FormModel.findOne().sort({ createdAt: -1 });
  }

  // Get calendar by ID
  async getAdminI9FormById(id: string): Promise<II9form | null> {
    return I9FormModel.findById(id);
  }

  async getAdminW4FormById(id: string): Promise<IW4Form | null> {
    return W4FormModel.findById(id);
  }

  // Delete calendar by ID
  async deleteAdminI9Form(id: string): Promise<II9form | null> {
    return I9FormModel.findByIdAndDelete(id);
  }

  async deleteAdminW4Form(id: string): Promise<IW4Form | null> {
    return W4FormModel.findByIdAndDelete(id);
  }

  // Update calendar by ID
  async updateAdminI9Form(
    id: string,
    data: Partial<II9form>
  ): Promise<II9form | null> {
    return I9FormModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateAdminW4Form(
    id: string,
    data: Partial<IW4Form>
  ): Promise<IW4Form | null> {
    return W4FormModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new AdminI9FormAndW4FormService();
