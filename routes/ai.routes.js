import express from "express";
import { getFileInsights, getQuizQuestions } from "../controller/ai.controller.js";
import { isAdmin, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/summary/:id",protectRoute, getFileInsights);
router.get("/quiz/:id", protectRoute, getQuizQuestions)

export default router;
