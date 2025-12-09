import express from "express";
import { saveMultipleUsers } from "../controllers/formController.js";

const router = express.Router();

router.post("/save-multiple", saveMultipleUsers);

export default router;
