import express from "express";
import { addfile, getAllFiles, getFileById } from "../controller/file.controller.js";
import { upload } from "../middleware/upload.middleware.js";
// import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";
import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addfile",protectRoute,isAdmin,upload.single("file"),addfile)
router.get("/", getAllFiles)
router.get("/:id" , getFileById)

export default router;