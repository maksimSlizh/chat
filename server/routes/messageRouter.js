import { Router } from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { sendMessage, getMessages, getUserConversations, createGroupConversation, sendGroupMessage } from '../controllers/message.controller.js';
const messageRouter = Router();

messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.post('/send/:id', protectRoute, sendMessage);
messageRouter.get('/conversations/your-conversations', protectRoute, getUserConversations);
messageRouter.post('/group/create', protectRoute, createGroupConversation);
messageRouter.post('/group/:id/send', protectRoute, sendGroupMessage);

export default messageRouter
