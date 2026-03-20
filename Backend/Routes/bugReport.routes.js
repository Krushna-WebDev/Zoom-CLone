import express from "express";
import { createBugReport } from "../Controllers/bugReport.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/create",upload.single('screenshot'), createBugReport);

export default router;
