import { WeeklyTimeSheetModel } from './timeSheet.model';
import { IWeeklyTimeSheet } from './timeSheet.interface';

const createWeeklyDetails = async (payload: IWeeklyTimeSheet) => {
  const result = await WeeklyTimeSheetModel.create(payload);
  return result;
};

const getAllWeeklyDetails = async () => {
  const result = await WeeklyTimeSheetModel.find();
  return result;
};

const getWeeklyDetailsById = async (id: string) => {
  const result = await WeeklyTimeSheetModel.findById(id);
  return result;
};

const updateWeeklyDetails = async (
  id: string,
  payload: Partial<IWeeklyTimeSheet>
) => {
  const result = await WeeklyTimeSheetModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteWeeklyDetails = async (id: string) => {
  const result = await WeeklyTimeSheetModel.findByIdAndDelete(id);
  return result;
};

export const WeeklyDetailsService = {
  createWeeklyDetails,
  getAllWeeklyDetails,
  getWeeklyDetailsById,
  updateWeeklyDetails,
  deleteWeeklyDetails,
};
