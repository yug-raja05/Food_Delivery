const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "🌿" }
  },
  { _id: false }
);

const cookingStepSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    actionText: { type: String, default: "" }
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      required: [true, "Category slug is required"],
      index: true
    },
    categoryLabel: {
      type: String,
      required: true
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    videoUrl: {
      type: String,
      default: ""
    },
    videoPoster: {
      type: String,
      default: ""
    },
    tags: [
      {
        type: String
      }
    ],
    cookingTime: {
      type: String,
      default: "15 mins"
    },
    technique: {
      type: String,
      default: "High-Flame Cooking"
    },
    spiceLevel: {
      type: String,
      default: "Medium Spicy 🔥"
    },
    ingredients: [ingredientSchema],
    cookingSteps: [cookingStepSchema],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
