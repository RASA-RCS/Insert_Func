import multer from "multer";
import path from "path";

// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, uniqueName);
    }
});

// Multer filter: allow only PDFs & images
const fileFilter = (req, file, cb) => {
    const allowedExt = [".png", ".jpg", ".jpeg", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(ext)) {
        return cb(new Error("Only PDF or Image files allowed!"), false);
    }

    cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
