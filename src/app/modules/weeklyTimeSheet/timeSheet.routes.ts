import express from 'express';
import { WeeklyDetailsController } from './timeSheet.controller';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/timeSheet',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  WeeklyDetailsController.createWeeklyDetails
);
router.get(
  '/timeSheet',
  auth(USER_ROLES.USER),
  WeeklyDetailsController.getAllWeeklyDetails
);
router.get(
  '/timeSheet/:id',
  auth(USER_ROLES.USER),
  WeeklyDetailsController.getWeeklyDetailsById
);
router.patch(
  '/timeSheet/:id',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  WeeklyDetailsController.updateWeeklyDetails
);
router.delete(
  '/timeSheet/:id',
  auth(USER_ROLES.USER),
  WeeklyDetailsController.deleteWeeklyDetails
);

export const TemporaryTimeSheetRoutes = router;
