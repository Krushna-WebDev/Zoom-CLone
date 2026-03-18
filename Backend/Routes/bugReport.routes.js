import express from "express"
import { createBugReport } from "../Controllers/bugReport.controller.js"

const router = express.Router()

router.post("/create",createBugReport)

export default router

