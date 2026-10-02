const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"]
    },
    image: {
      type: String,
      default: ""
    },
    subtotal: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      index: true
    },
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true
      }
    },
    orderType: {
      type: String,
      enum: ["takeaway", "delivery", "dinein"],
      required: [true, "Order type is required"],
      default: "takeaway"
    },
    deliveryAddress: {
      address: { type: String, trim: true },
      landmark: { type: String, trim: true },
      pincode: { type: String, trim: true, default: "560027" }
    },
    tableNumber: {
      type: Number,
      min: 1
    },
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Order must contain at least one item"
      ]
    },
    cookingInstructions: {
      type: String,
      default: "",
      trim: true
    },
    couponCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0
    },
    packagingFee: {
      type: Number,
      required: true,
      default: 15
    },
    discount: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "upi"],
      default: "cod"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cod"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "completed",
        "cancelled"
      ],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
