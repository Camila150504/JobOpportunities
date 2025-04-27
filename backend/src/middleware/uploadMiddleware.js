import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("File is being uploaded to: uploads/");
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        console.log("Saving file as:", uniqueName); // Log the unique file name
        cb(null, uniqueName); // Ensure the file name is unique
    }
});

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
