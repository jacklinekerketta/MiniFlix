import express from "express";
import {
  addVideo,
  getVideos,
  getVideoById,
  searchVideos,
  filterByTags,
} from "../controllers/videoController.js";

import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Protected add
router.post("/", isAuth, addVideo);

// Public browse
router.get("/", getVideos);
router.get("/search", searchVideos);
router.get("/filter", filterByTags);
router.get("/:id", getVideoById);

export default router;
