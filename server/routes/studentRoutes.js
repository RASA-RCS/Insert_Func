// server/routes/studentRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { registerStudent, getAllStudents, getStudentById } from "../controllers/studentController.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload fields for multiple files
const uploadFields = upload.fields([
  { name: "marksheet10", maxCount: 1 },
  { name: "marksheet12", maxCount: 1 },
  { name: "marksheetGrad", maxCount: 1 },
  { name: "marksheetSem", maxCount: 10 },
  { name: "resume", maxCount: 1 },
]);

// Routes
router.post("/register", uploadFields, registerStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
