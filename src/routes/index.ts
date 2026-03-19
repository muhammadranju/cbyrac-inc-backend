import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { InternRoutes } from '../app/modules/internForm/internRoutes';
import { AdminFormRoutes } from '../app/modules/adminForm/admin.routes';
import { TemporaryRouter } from '../app/modules/temporaryForm/temporaryRoutes';
import { CalendarRoutes } from '../app/modules/adminCalender/calendar.route';
import { TemporaryTimeSheetRoutes } from '../app/modules/weeklyTimeSheet/timeSheet.routes';
import { InternTimeSheetRoutes } from '../app/modules/weeklyTimeSheetIntern/timeSheet.routes';
import { AdminTimeSheetRoutes } from '../app/modules/adminTimeSheetUp/adminTimeSheetRoute';
import { AdminI9FormAndW4FormRoute } from '../app/modules/adimI9FormAndW4Form/route';
import { AdminI9FormAndW4FormExampleRouter } from '../app/modules/adminExamplei9FormAndw4Form/example.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/internForm',
    route: InternRoutes,
  },
  {
    path: '/temporaryForm',
    route: TemporaryRouter,
  },
  {
    path: '/temporary',
    route: TemporaryTimeSheetRoutes,
  },
  {
    path: '/intern',
    route: InternTimeSheetRoutes,
  },

  {
    path: '/calendar',
    route: CalendarRoutes,
  },
  {
    path: '/time-sheet',
    route: AdminTimeSheetRoutes,
  },

  {
    path: '/admin',
    route: AdminFormRoutes,
  },
  {
    path: '/pdf',
    route: AdminI9FormAndW4FormRoute,
  },
  {
    path: '/example',
    route: AdminI9FormAndW4FormExampleRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
