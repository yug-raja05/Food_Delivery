const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  createFeedback,
  getAllFeedback,
  getItemFeedback,
  getFeedbackStats,
  getItemFeedbackStats
} = require("../controllers/feedbackController");

// Spam protection rate-limiter specifically for feedback submissions
const feedbackSubmissionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // limit each IP to 15 submissions per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You have submitted feedback recently. Please wait a few moments before submitting again."
  }
});

// Feedback routes
router.post("/", feedbackSubmissionLimiter, createFeedback);
router.get("/", getAllFeedback);
router.get("/stats", getFeedbackStats);
router.get("/item/:itemId", getItemFeedback);
router.get("/item/:itemId/stats", getItemFeedbackStats);

module.exports = router;
