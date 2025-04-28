import ChatMessage from '../models/ChatMessage.js';

export const getConversation = async (req, res) => {
  const { userId, peerId } = req.params;
  const messages = await ChatMessage.find({
    $or: [
      { senderId: userId, receiverId: peerId },
      { senderId: peerId, receiverId: userId },
    ]
  }).sort('createdAt');

  res.json(messages);
};
