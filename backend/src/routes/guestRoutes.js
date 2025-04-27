import express from "express"
import { getAllUsers, loginUser, registerUser } from "../controllers/userController.js"
import { verifyEmail } from "../controllers/userController.js";
import { getAllCompanies, createCompany, assignCompanyToUser } from '../controllers/companyController.js';
import { forgotPassword, resetPassword } from "../controllers/userController.js";

const guestRoutes = express.Router()

guestRoutes.get('/', getAllUsers)
guestRoutes.post('/register', registerUser)
guestRoutes.post('/registerCompany', createCompany);
guestRoutes.get('/companies', getAllCompanies);
guestRoutes.put('/:userId/assign-company', assignCompanyToUser);
guestRoutes.post('/login', loginUser)
guestRoutes.get('/verify-email/:token', verifyEmail)
guestRoutes.post('/forgot-password', forgotPassword);
guestRoutes.post('/reset-password/:token', resetPassword);
guestRoutes.get('/reset-password/:token', (req, res) => {
    res.send(`
      <h2>Password Reset</h2>
      <p>This link should be opened in the mobile app.</p>
    `);
  });  

export default guestRoutes