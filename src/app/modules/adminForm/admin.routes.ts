import express from 'express';
import { AdminFormController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/job',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  AdminFormController.createAdminForm
);
router.get(
  '/job',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminFormController.getAllAdminForms
);
router.get(
  '/job/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminFormController.getAdminFormById
);
router.patch(
  '/job/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  AdminFormController.updateAdminForm
);
router.delete(
  '/job/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminFormController.deleteAdminForm
);

export const AdminFormRoutes = router;
