import { Router } from 'express';
import CalendarController from './calendar.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.post('/', fileUploadHandler(), CalendarController.create);
router.get('/', CalendarController.getAll);
router.get('/:id', CalendarController.getById);
router.put('/:id', fileUploadHandler(), CalendarController.update);
router.delete('/:id', CalendarController.delete);
export const CalendarRoutes = router;
