import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
}).fields([
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "graduationMarksheet", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "semesterMarksheets", maxCount: 10 },
]);
