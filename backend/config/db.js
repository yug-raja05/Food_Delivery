const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const MenuItem = require("../models/MenuItem");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zion_food_corner");
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-sync initial feedbacks to ensure exactly 3 5-star verified reviews
    try {
      const existingReviews = await Feedback.find();
      const hasOldReviews = existingReviews.some((r) => r.name === "Ananya Patel" || r.name === "Vikram Kumar");
      
      if (existingReviews.length === 0 || hasOldReviews) {
        if (hasOldReviews) {
          await Feedback.deleteMany({ name: { $in: ["Rahul Sharma", "Priya Sundaram", "Mohammed Farhan", "Ananya Patel", "Vikram Kumar"] } });
        }

        const countAfter = await Feedback.countDocuments();
        if (countAfter === 0) {
          const biryaniItem = await MenuItem.findOne({ name: /biryani/i });
          const friedRiceItem = await MenuItem.findOne({ name: /fried rice/i });

          await Feedback.insertMany([
            {
              name: "Rahul Sharma",
              itemId: biryaniItem ? biryaniItem._id : null,
              itemName: biryaniItem ? biryaniItem.name : "Chicken Biryani",
              rating: 5,
              message: "Very tasty biryani and excellent service! The aroma of the spices is incredible and the chicken is juicy and tender. Will order again!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
            },
            {
              name: "Priya Sundaram",
              itemId: friedRiceItem ? friedRiceItem._id : null,
              itemName: friedRiceItem ? friedRiceItem.name : "Chicken Fried Rice",
              rating: 5,
              message: "Best fried rice in S R Nagar! Great wok flavour, very authentic street-style taste and fresh ingredients every time.",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
            },
            {
              name: "Mohammed Farhan",
              itemId: null,
              itemName: "Overall Restaurant Experience",
              rating: 5,
              message: "Fast service, clean packaging, and truly affordable prices. Zion Food Corner has become our favorite daily spot!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
            }
          ]);
          console.log("[MongoDB Auto-Seed]: Successfully synchronized customer feedback with 3 5-star reviews.");
        }
      }
    } catch (seedErr) {
      console.warn("[MongoDB Seed Notice]:", seedErr.message);
    }
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
