import express from 'express'
import cors from "cors"
import morgan from "morgan"
import conn from './src/config/db.js'
import guestRoutes from './src/routes/guestRoutes.js'
import employeeRoutes from './src/routes/employeeRoutes.js'
import employerRoutes from './src/routes/employerRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectMongoDB } from './src/config/mongo.js'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { disconnect } from 'process'
import ChatMessage from './src/models/ChatMessage.js'
import chatRoutes from './src/routes/chatRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'


const server = express()
const PORT = process.env.PORT
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(morgan("dev"))
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

try {
    await conn.authenticate()
    console.log("connected to MySQL")
    await conn.sync()
} catch(err){
    console.log("unnable to connect to MySQL")
}

try{
    await connectMongoDB()
}catch (err){
    console.log('Couldnt connect to Mongo', err)
}

server.use('/api/users', guestRoutes)
server.use('/api/employee', employeeRoutes)
server.use('/api/employer', employerRoutes)
server.use('/api/chat', chatRoutes)
server.use('/api/admin', adminRoutes)

server.get("/", (Req, Res) => {
    Res.json({message: "Backend is running"})
})

const httpServer = createServer(server)
const io = new SocketServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log('Socket connected:', socket.id);
  
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`🔑 ${socket.id} joined room ${roomId}`);
    });
  
    socket.on('send_message', async data => {
      try {
        const { senderId, receiverId, text } = data;
        const roomId = [senderId, receiverId].sort().join('_');
  
        const newMessage = await ChatMessage.create({ senderId, receiverId, text });
        
        io.to(roomId).emit('receive_message', {
          _id: newMessage._id,
          text: newMessage.text,
          createdAt: newMessage.createdAt,
          user: { _id: newMessage.senderId }
        });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });
  
    socket.on('disconnect', () => {
      console.log(' Socket disconnected:', socket.id);
    });
  });

httpServer.listen(PORT, () => {
    console.log(`Server + WebSocket running on port ${PORT}`)
})