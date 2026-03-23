import express from 'express';
import { GenerateInternPdf, InternController } from './internController';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/intern',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  InternController.createIntern
);

router.get('/intern', auth(USER_ROLES.USER), InternController.getAllInterns);

router.get('/intern/:id', InternController.getIntern);

// router.patch('/intern/:id', fileUploadHandler(), InternController.updateIntern);

router.delete('/intern/:id', InternController.deleteIntern);
router.get('/pdf/:id', GenerateInternPdf);
export const InternRoutes = router;
