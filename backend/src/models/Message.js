import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: Number, required: true }, // user id (employee or employer)
    receiverId: { type: Number, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
