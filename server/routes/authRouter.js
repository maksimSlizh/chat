import { Router } from 'express';
const authRouter = Router();
import { signup, login, logout, updateAvatar, changePassword } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';


authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/change-avatar', updateAvatar);
authRouter.post('/change-password', protectRoute, changePassword);

export default authRouter
