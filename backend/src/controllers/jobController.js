
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js"
import JobApplicant from "../models/JobApplicant.js";

export const createJob = async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("User from token:", req.user);
  
      const user = await User.findByPk(req.user.id);
      if (!user || !user.companyId) {
        return res.status(400).json({ message: 'User not associated with a company' });
      }
  
      const { title, department, description, requirements } = req.body;
  
      const job = await Job.create({
        title,
        department,
        description,
        requirements,
        companyId: user.companyId
      });
  
      res.status(201).json({ job });
    } catch (error) {
      console.error("Job creation error:", error);
      res.status(400).json({ message: 'Error creating job', error });
    }
  };
  
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({ include: Company });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

export const getMyJobs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    console.log("Employer ID:", req.user.id);
    console.log("Employer record:", user?.toJSON());

    if (!user || !user.companyId) {
      return res.status(400).json({ message: "User has no company assigned" });
    }

    const jobs = await Job.findAll({
      where: { companyId: user.companyId },
      include: [Company],
      order: [["createdAt", "DESC"]],
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs", error });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  try {
      const job = await Job.findOne({ where: { id, companyId } });

      if (!job) {
          return res.status(404).json({ message: "Job not found or unauthorized" });
      }

      await job.destroy(); // This will cascade delete applicants if configured

      res.json({ message: "Job and related applications deleted" });
  } catch (error) {
      res.status(500).json({ message: "Failed to delete job", error });
  }
};