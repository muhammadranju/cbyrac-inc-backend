import { Router } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import AdminI9FormAndW4FormController from '../../modules/adimI9FormAndW4Form/controller';

const router = Router();

router.post(
  '/i9form',
  fileUploadHandler(),
  AdminI9FormAndW4FormController.createI9Form
);
router.post(
  '/w4form',
  fileUploadHandler(),
  AdminI9FormAndW4FormController.createW4Form
);
router.get('/i9form', AdminI9FormAndW4FormController.getAllI9Form);
router.get('/w4form', AdminI9FormAndW4FormController.getAllW4Form);

router.get('/:id/i9form', AdminI9FormAndW4FormController.getByIdI9Form);
router.get('/:id/w4form', AdminI9FormAndW4FormController.getByIdW4Form);

router.put(
  '/:id/i9form',
  fileUploadHandler(),
  AdminI9FormAndW4FormController.updateI9Form
);
router.put(
  '/:id/w4form',
  fileUploadHandler(),
  AdminI9FormAndW4FormController.updateW4Form
);
router.delete('/:id/i9form', AdminI9FormAndW4FormController.deleteI9Form);
router.delete('/:id/w4form', AdminI9FormAndW4FormController.deleteW4Form);
export const AdminI9FormAndW4FormRoute = router;
