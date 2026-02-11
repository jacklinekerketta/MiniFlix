import express from "express";
import {
  addVideo,
  getVideos,
  getVideoById,
  searchVideos,
  filterByTags,
  getManifestById,
} from "../controllers/videoController.js";

import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Protected add
router.post("/", isAuth, addVideo);

// Public browse / metadata
router.get("/", getVideos);
router.get("/search", searchVideos);
router.get("/filter", filterByTags);

// 🔒 Protected: manifest / streaming entrypoint
router.get("/:id/manifest", isAuth, getManifestById);

// Public: basic metadata for detail page (no manifest here)
router.get("/:id", getVideoById);

export default router;
