const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      default: null
    },
    itemName: {
      type: String,
      trim: true,
      default: "Overall Restaurant Experience"
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v >= 1 && v <= 5;
        },
        message: "Rating must be an integer between 1 and 5"
      }
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters long"],
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for fast query by creation date and item
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ itemId: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
