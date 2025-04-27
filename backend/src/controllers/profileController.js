import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; 
        const filePath = req.file.path; 

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.profile_picture = filePath.replace(/\\/g, '/');

        await user.save();

        res.json({ message: "Profile picture uploaded successfully", profile_picture: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed", error });
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const downloadCV = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user || !user.cv_file) {
            return res.status(404).json({ message: "CV not found" });
        }

        const fullPath = path.resolve(__dirname, '../../', user.cv_file);

        res.download(fullPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Download failed", error });
    }
};

export const uploadCV = async (req, res) => {
    console.log(req.file)
    try {
        const userId = req.user.id; 
        const filePath = req.file.path; 

        const user = await User.findByPk(userId);
        console.log(user.cv_file)
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cv_file = filePath.replace(/\\/g, '/'); 

        try {
            await user.save();
        } catch (error) {
            console.error('Error saving user:', error);  
            res.status(500).json({ message: "Upload failed", error });
        }

        res.json({ message: "CV uploaded successfully", cv_file: filePath });
    } catch (error) {
        console.error('error in uploadCV', error);
        res.status(500).json({ message: "Upload failed", error });
    }
};
