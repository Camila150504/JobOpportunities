import express, { Router } from 'express'
import { authenticate, authorizeRole } from '../middleware/auth.js'
import { createJob, getMyJobs, deleteJob } from '../controllers/jobController.js'
import { getApplicantsForJob, updateApplicationStatus } from '../controllers/JobApplicantController.js'

const employerRoutes = express.Router()

employerRoutes.use(authenticate)
employerRoutes.use(authorizeRole('employer'))

employerRoutes.get('/dashboard', (req, res) => {
    res.json({ message: 'Employer dashboard' })
})
employerRoutes.post('/jobs', createJob)
employerRoutes.get("/my-jobs", getMyJobs)
employerRoutes.delete("/jobs/:id", deleteJob)
employerRoutes.get('/jobs/:jobId/applicants', getApplicantsForJob);
employerRoutes.put("/applications/:id/status", updateApplicationStatus);

export default employerRoutes