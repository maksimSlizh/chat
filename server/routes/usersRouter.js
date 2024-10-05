import { Router } from 'express';
import { findUserByUsername, getAllUsers } from '../controllers/user.controller.js';
import isAdmin from '../middleware/isAdmin.js';
import protectRoute from '../middleware/protectRoute.js';

const usersRouter = Router();

usersRouter.get('/:username', protectRoute , findUserByUsername);
usersRouter.get('/users/all', protectRoute, isAdmin, getAllUsers);

export default usersRouter
