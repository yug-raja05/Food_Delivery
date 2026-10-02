const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ["fixed", "percent"],
      required: true,
      default: "fixed"
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"]
    },
    minOrder: {
      type: Number,
      default: 0,
      min: [0, "Minimum order cannot be negative"]
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
