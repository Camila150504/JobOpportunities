import express from 'express'
import ChatMessage from "../models/ChatMessage.js"
import { authenticate } from '../middleware/auth.js'
import { getConversation } from '../controllers/chatController.js';

const chatRoutes = express.Router()

chatRoutes.get('/:userId/:peerId', getConversation);

export default chatRoutes