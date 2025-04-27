import express, { Router } from 'express'
import { authenticate, authorizeRole } from '../middleware/auth.js'
import { getAllJobs } from '../controllers/jobController.js'
import { applyToJob, deleteApplication } from '../controllers/jobApplicationController.js'
import { getMyApplications } from '../controllers/jobApplicationController.js'
import { updateProfilePicture, uploadCV, downloadCV } from '../controllers/profileController.js'
import { upload } from '../middleware/uploadMiddleware.js'
import { getMyProfile } from '../controllers/userController.js'

const employeeRoutes = express.Router()

employeeRoutes.use(authenticate)
employeeRoutes.use(authorizeRole('employee'))

employeeRoutes.get('/dashboard', (req, res) => {
    res.json({message: 'Employee'})
})

employeeRoutes.get('/jobs', getAllJobs)
employeeRoutes.post('/apply/:jobId', applyToJob)
employeeRoutes.get('/my-applications', getMyApplications)
employeeRoutes.delete('/my-applications/:id', deleteApplication);
employeeRoutes.post('/upload-picture', upload.single('profilePicture'), updateProfilePicture)
employeeRoutes.get('/download-cv/:userId', downloadCV)
employeeRoutes.post('/upload-cv', (req, res, next) => {
    console.log("Multer middleware received file:", req.file); // Log the file at this stage
    console.log("Form data:", req.body);  // Log the form data as well
    next();  // Proceed to the next middleware/controller
}, upload.single('cv_file'), uploadCV);
employeeRoutes.get('/me', getMyProfile)
export default employeeRoutes