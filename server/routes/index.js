import { Router } from 'express';
const router = Router();
import authRouter from './authRouter.js';
import messageRouter from './messageRouter.js';

router.use('/auth', authRouter);
router.use('/message', messageRouter);

export default router
