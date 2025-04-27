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
    connectMongoDB()
}catch (err){
    console.log('Couldnt connect to Mongo', err)
}

server.use('/api/users', guestRoutes)
server.use('/api/employee', employeeRoutes)
server.use('/api/employer', employerRoutes)

server.get("/", (Req, Res) => {
    Res.json({message: "Backend is running"})
})

server.listen(PORT, ()=> console.log(`Server listening on PORT ${PORT}`))