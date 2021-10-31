import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import financeRouter from './finance';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/finance', financeRouter);

export default router;
