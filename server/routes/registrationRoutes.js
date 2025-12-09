import express from "express";
import { registerUser } from "../controllers/registrationController.js";
import upload from "../utils/multerUpload.js";

const router = express.Router();

// Multiple file fields
const uploadFields = upload.fields([
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "graduationMarksheet", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "semesterMarksheets", maxCount: 20 } // supports 20 semesters
]);

router.post("/register", uploadFields, registerUser);

export default router;
