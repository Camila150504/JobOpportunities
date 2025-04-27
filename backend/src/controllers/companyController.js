import Company from "../models/Company.js";
import User from "../models/User.js";

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch companies', error });
    }
};

export const createCompany = async (req, res) => {
    const { name } = req.body;
    try {
        const company = await Company.create({ name });
        res.status(201).json({ message: 'Company created', company });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create company', error });
    }
};

export const assignCompanyToUser = async (req, res) => {
    const { companyId } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.companyId = companyId;
        await user.save();

        res.json({ message: 'Company assigned to user', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign company', error });
    }
};
