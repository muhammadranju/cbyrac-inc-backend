import { Router } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import AdminTimeSheetController from './adminTimeSheetController';

const router = Router();

router.post('/', fileUploadHandler(), AdminTimeSheetController.createTimeSheet);
router.get('/', AdminTimeSheetController.getAllTimeSheet);
router.get('/:id', AdminTimeSheetController.getByIdTimeSheet);
router.put(
  '/:id',
  fileUploadHandler(),
  AdminTimeSheetController.updateTimeSheet
);
router.delete('/:id', AdminTimeSheetController.deleteTimeSheet);
export const AdminTimeSheetRoutes = router;
