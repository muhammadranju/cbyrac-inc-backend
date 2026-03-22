import { AdminFormModel } from './admin.model';
import { IAdminForm } from './admin.interface';

// Create
const createAdminForm = async (payload: IAdminForm) => {
  const result = await AdminFormModel.create(payload);
  return result;
};

// Get all
const getAllAdminForms = async () => {
  const result = await AdminFormModel.find().sort({ createdAt: -1 });
  return result;
};

// Get single by ID
const getAdminFormById = async (id: string) => {
  const result = await AdminFormModel.findById(id);
  return result;
};

// Update
const updateAdminForm = async (id: string, payload: Partial<IAdminForm>) => {
  const result = await AdminFormModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// Delete
const deleteAdminForm = async (id: string) => {
  const result = await AdminFormModel.findByIdAndDelete(id);
  return result;
};

export const AdminFormService = {
  createAdminForm,
  getAllAdminForms,
  getAdminFormById,
  updateAdminForm,
  deleteAdminForm,
};
