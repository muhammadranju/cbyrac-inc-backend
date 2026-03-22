import { ExampleI9FormModel, ExampleW4FormModel } from './example.model';

class AdminI9FormAndW4FormExampleService {
  /**
   * Create I9 Form
   */
  static async createAdminI9Form(payload: { image: string[] }) {
    const result = await ExampleI9FormModel.create(payload);
    return result;
  }

  /**
   * Get Latest I9 Form
   */
  static async getLatestI9Form() {
    const result = await ExampleI9FormModel.findOne().sort({
      createdAt: -1,
    });
    return result;
  }

  /**
   * Create W4 Form
   */
  static async createAdminW4Form(payload: { image: string[] }) {
    const result = await ExampleW4FormModel.create(payload);
    return result;
  }

  /**
   * Get Latest W4 Form
   */
  static async getLatestW4Form() {
    const result = await ExampleW4FormModel.findOne().sort({
      createdAt: -1,
    });
    return result;
  }
}

export default AdminI9FormAndW4FormExampleService;
