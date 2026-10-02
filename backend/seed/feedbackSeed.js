const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/db");
const Feedback = require("../models/Feedback");
const MenuItem = require("../models/MenuItem");

const SEED_FEEDBACKS = [
  {
    name: "Rahul Sharma",
    itemName: "Chicken Biryani",
    itemSearchName: "Chicken Biryani",
    rating: 5,
    message: "Very tasty biryani and excellent service! The aroma of the spices is incredible and the chicken is juicy and tender. Will order again!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    name: "Priya Sundaram",
    itemName: "Chicken Fried Rice",
    itemSearchName: "Chicken Fried Rice",
    rating: 5,
    message: "Best fried rice in S R Nagar! Great wok flavour, very authentic street-style taste and fresh ingredients every time.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    name: "Mohammed Farhan",
    itemName: "Overall Restaurant Experience",
    rating: 5,
    message: "Fast service, clean packaging, and truly affordable prices. Zion Food Corner has become our go-to spot for weekend cravings!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) // 1 day ago
  }
];

async function seedFeedbacks() {
  try {
    await connectDB();

    console.log("Seeding Customer Feedback data...");
    
    // Check if feedback already exists
    const existingCount = await Feedback.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️ Feedbacks collection already has ${existingCount} reviews. Skipping destructive overwrite.`);
      process.exit(0);
    }

    // Connect itemIds if available
    const menuItems = await MenuItem.find();
    const itemMap = new Map();
    menuItems.forEach((m) => {
      itemMap.set(m.name.toLowerCase().trim(), m._id);
    });

    const docsToInsert = SEED_FEEDBACKS.map((fb) => {
      let itemId = null;
      if (fb.itemSearchName) {
        const foundId = itemMap.get(fb.itemSearchName.toLowerCase().trim());
        if (foundId) itemId = foundId;
      }
      return {
        name: fb.name,
        itemId: itemId,
        itemName: fb.itemName,
        rating: fb.rating,
        message: fb.message,
        createdAt: fb.createdAt
      };
    });

    await Feedback.insertMany(docsToInsert);
    console.log(`✅ Successfully seeded ${docsToInsert.length} initial customer feedbacks!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding feedback:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedFeedbacks();
}

module.exports = seedFeedbacks;
