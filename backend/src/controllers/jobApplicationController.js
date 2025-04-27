import JobApplicant from '../models/JobApplicant.js';
import Job from '../models/Job.js';

export const applyToJob = async (req, res) => {
    const { jobId } = req.params;
    const { description } = req.body;
    const userId = req.user.id; 

    try {
        const alreadyApplied = await JobApplicant.findOne({
            where: { jobId, userId }
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this job.' });
        }

        const application = await JobApplicant.create({
            jobId,
            userId,
            description,
        });

        res.status(201).json({ message: 'Application submitted', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to apply', error });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const applications = await JobApplicant.findAll({
            where: { userId: req.user.id },
            include: {
                model: Job,
                include: ['Company']
            },
            order: [['createdAt', 'DESC']],
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

export const deleteApplication = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const application = await JobApplicant.findOne({ where: { id, userId } });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or unauthorized' });
        }

        await application.destroy();
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete application', error });
    }
};
