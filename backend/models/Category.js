const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      trim: true,
      lowercase: true
    },
    icon: {
      type: String,
      default: "fas fa-utensils"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);
