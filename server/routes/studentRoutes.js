import express from "express";
import upload from "../middleware/upload.js";
import { registerStudent, getAllStudents, getStudentById } from "../controllers/studentController.js";

const router = express.Router();

/* ---- FILE UPLOAD FIELDS ---- */
const uploadFields = upload.fields([
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "marksheetGrad", maxCount: 1 },
    { name: "marksheetSem", maxCount: 10 }, // multiple files
    { name: "resume", maxCount: 1 },
]);

router.post("/register", uploadFields, registerStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
