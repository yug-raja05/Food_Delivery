const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const MenuItem = require("../models/MenuItem");

// Helper to resolve itemId (numeric or ObjectId) to MenuItem document
async function resolveMenuItem(itemId) {
  if (!itemId || itemId === "restaurant" || itemId === "overall" || itemId === "null" || itemId === "undefined") {
    return null;
  }

  let item = null;
  // If numeric ID (e.g. 1, 2, 3...)
  if (!isNaN(Number(itemId))) {
    item = await MenuItem.findOne({ id: Number(itemId) });
  }

  // If Mongo ObjectId
  if (!item && mongoose.Types.ObjectId.isValid(itemId)) {
    item = await MenuItem.findById(itemId);
  }

  return item;
}

// @desc    Create new customer feedback / review
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res, next) => {
  try {
    let { name, itemId, itemName, rating, message } = req.body;

    // 1. Validation: Name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required (at least 2 characters)."
      });
    }
    name = name.trim().slice(0, 100);

    // 2. Validation: Message
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required (at least 5 characters)."
      });
    }
    message = message.trim().slice(0, 500);

    // 3. Validation: Rating (Integer between 1 and 5)
    rating = Number(rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5 stars."
      });
    }

    // 4. Resolve MenuItem if itemId is provided
    let resolvedItemId = null;
    let resolvedItemName = itemName ? itemName.trim() : "Overall Restaurant Experience";

    if (itemId && itemId !== "restaurant" && itemId !== "overall") {
      const menuItem = await resolveMenuItem(itemId);
      if (menuItem) {
        resolvedItemId = menuItem._id;
        resolvedItemName = menuItem.name;
      }
    }

    // 5. Create feedback record in MongoDB
    const feedback = await Feedback.create({
      name,
      itemId: resolvedItemId,
      itemName: resolvedItemName,
      rating,
      message
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback! ❤️",
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback / reviews (latest first)
// @route   GET /api/feedback
// @access  Public
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { limit, itemId } = req.query;
    const query = {};

    if (itemId) {
      const item = await resolveMenuItem(itemId);
      if (item) {
        query.itemId = item._id;
      }
    }

    let feedbackQuery = Feedback.find(query).sort({ createdAt: -1 });

    if (limit && !isNaN(Number(limit))) {
      feedbackQuery = feedbackQuery.limit(Number(limit));
    }

    const feedbacks = await feedbackQuery.exec();

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback for a specific food item
// @route   GET /api/feedback/item/:itemId
// @access  Public
exports.getItemFeedback = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await resolveMenuItem(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with identifier: ${itemId}`
      });
    }

    const feedbacks = await Feedback.find({ itemId: item._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      itemId: item._id,
      itemName: item.name,
      data: feedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall restaurant feedback statistics (Total count & Average rating)
// @route   GET /api/feedback/stats
// @access  Public
exports.getFeedbackStats = async (req, res, next) => {
  try {
    const totalCount = await Feedback.countDocuments();

    if (totalCount === 0) {
      return res.status(200).json({
        success: true,
        totalFeedback: 0,
        averageRating: 5.0,
        data: {
          totalFeedback: 0,
          averageRating: 5.0
        }
      });
    }

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 }
        }
      }
    ]);

    const rawAvg = stats.length > 0 ? stats[0].avgRating : 5.0;
    const averageRating = Number(Math.round(rawAvg + "e1") + "e-1"); // Standard 1 decimal rounding

    res.status(200).json({
      success: true,
      totalFeedback: totalCount,
      averageRating: averageRating,
      data: {
        totalFeedback: totalCount,
        averageRating: averageRating
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics for a specific food item
// @route   GET /api/feedback/item/:itemId/stats
// @access  Public
exports.getItemFeedbackStats = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await resolveMenuItem(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with identifier: ${itemId}`
      });
    }

    const totalReviews = await Feedback.countDocuments({ itemId: item._id });

    if (totalReviews === 0) {
      return res.status(200).json({
        success: true,
        itemId: item._id,
        itemName: item.name,
        totalReviews: 0,
        averageRating: 0,
        data: {
          totalReviews: 0,
          averageRating: 0
        }
      });
    }

    const stats = await Feedback.aggregate([
      { $match: { itemId: item._id } },
      {
        $group: {
          _id: "$itemId",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 }
        }
      }
    ]);

    const rawAvg = stats.length > 0 ? stats[0].avgRating : 0;
    const averageRating = Number(Math.round(rawAvg + "e1") + "e-1");

    res.status(200).json({
      success: true,
      itemId: item._id,
      itemName: item.name,
      totalReviews: totalReviews,
      averageRating: averageRating,
      data: {
        totalReviews: totalReviews,
        averageRating: averageRating
      }
    });
  } catch (error) {
    next(error);
  }
};
