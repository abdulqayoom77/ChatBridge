import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// Add a test endpoint to check environment variables
router.get("/test-env", (req, res) => {
  res.json({
    hasStreamApiKey: !!process.env.STREAM_API_KEY,
    hasStreamApiSecret: !!process.env.STREAM_API_SECRET,
    streamApiKeyLength: process.env.STREAM_API_KEY?.length || 0,
    streamApiSecretLength: process.env.STREAM_API_SECRET?.length || 0,
  });
});

router.get("/token", protectRoute, getStreamToken);

export default router;
