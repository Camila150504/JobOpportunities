import express from 'express'
import { getAllUsers, deleteUser} from '../controllers/userController.js'
import {authenticate} from '../middleware/auth.js'

const adminRoutes = express.Router()

adminRoutes.use(authenticate)

adminRoutes.get('/getAllUsers', getAllUsers)
adminRoutes.delete('/users/:id', deleteUser)

export default adminRoutes