import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import AdminI9FormAndW4FormExampleController from './example.controller';
const router = express.Router();

/**
 * I9 Form Routes
 */
router.post(
  '/i9',
  //   auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  AdminI9FormAndW4FormExampleController.createI9Form
);

router.get('/i9/', AdminI9FormAndW4FormExampleController.getLatestI9Form);

/**
 * W4 Form Routes
 */
router.post(
  '/w4',
  //   auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  AdminI9FormAndW4FormExampleController.createW4Form
);

router.get('/w4', AdminI9FormAndW4FormExampleController.getLatestW4Form);

export const AdminI9FormAndW4FormExampleRouter = router;
