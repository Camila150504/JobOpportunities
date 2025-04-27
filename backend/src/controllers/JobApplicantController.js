import JobApplicant from '../models/JobApplicant.js';
import User from '../models/User.js';


export const getApplicantsForJob = async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.user.companyId;

    try {
        const applicants = await JobApplicant.findAll({
            where: { jobId },
            include: {
                model: User,
                attributes: ['id', 'first_name', 'last_name', 'email'],
            },
        });

        res.json(applicants);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch applicants', error });
    }
};

export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const validStatuses = ['Waiting', 'In Process', 'Accepted', 'Rejected'];
  
    // This line helps diagnose:
    console.log("Received status:", status);
  
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    try {
      const application = await JobApplicant.findByPk(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      application.status = status;
      await application.save();
  
      res.json({ message: "Status updated", application });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status", error });
    }
  };
  

