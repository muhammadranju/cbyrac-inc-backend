import express from 'express';
import {
  GenerateTemporaryPdf,
  temporaryFormController,
} from './temporaryController';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { generateCbyracPdf } from './pdfGenerator';

const router = express.Router();

router.post(
  '/temporary',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  temporaryFormController.createForm
);

router.get(
  '/temporary',
  auth(USER_ROLES.USER),
  temporaryFormController.getAllForms
);
router.get('/pdf-generator', auth(USER_ROLES.USER), generateCbyracPdf);
// router.get(
//   '/temporary/:id',
//   auth(USER_ROLES.USER),
//   temporaryFormController.getFormById
// );
// router.patch(
//   '/temporary/update/:id',
//   fileUploadHandler(),
//   temporaryFormController.updateForm
// );
router.delete(
  '/temporary/:id',
  auth(USER_ROLES.USER),
  temporaryFormController.deleteForm
);
router.get('/pdf/:id', GenerateTemporaryPdf);

export const TemporaryRouter = router;
