import express from "express";
import { signup, login, getinfo } from "../controller/user.controller.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/:id",getinfo)
export default router;