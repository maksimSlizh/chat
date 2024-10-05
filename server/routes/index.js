import { Router } from 'express';
const router = Router();
import authRouter from './authRouter.js';
import messageRouter from './messageRouter.js';
import usersRouter from './usersRouter.js';

router.use('/auth', authRouter);
router.use('/message', messageRouter);
router.use('/users', usersRouter);

export default router
