const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const MenuItem = require("../models/MenuItem");

/**
 * Connect to MongoDB Atlas using Mongoose
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error("MongoDB Atlas connection failed: MONGODB_URI is not defined in backend/.env");
    console.error("Please add your MongoDB Atlas connection string in backend/.env:");
    console.error("MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/zion_food_corner");
    throw new Error("MONGODB_URI environment variable missing");
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000 // 10-second timeout for Atlas network connectivity
    });

    console.log(`MongoDB Atlas connected successfully (${conn.connection.host}/${conn.connection.name})`);

    // Auto-sync initial feedback reviews if collection is empty
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
          console.log("[MongoDB Atlas]: Synchronized initial verified customer reviews.");
        }
      }
    } catch (seedErr) {
      console.warn("[MongoDB Atlas Sync Warning]:", seedErr.message);
    }

    return conn;
  } catch (error) {
    console.error("MongoDB Atlas connection failed:");

    // Helpful diagnostics without exposing credentials
    if (error.message.includes("bad auth") || error.message.includes("Authentication failed") || error.code === 8000) {
      console.error("👉 [Auth Error]: Invalid username or password in MONGODB_URI.");
      console.error("   Make sure special characters in your password (like @, #, $, %, etc.) are URL-encoded.");
    } else if (error.message.includes("querySrv ENOTFOUND") || error.message.includes("ENOTFOUND")) {
      console.error("👉 [DNS Error]: Cluster address could not be resolved. Please verify your Atlas connection string.");
    } else if (error.message.includes("whitelist") || error.message.includes("ETIMEDOUT") || error.message.includes("ECONNREFUSED") || error.name === "MongooseServerSelectionError") {
      console.error("👉 [Network/IP Error]: Could not reach MongoDB Atlas.");
      console.error("   Please ensure your IP is allowed in Atlas: Security -> Network Access -> Add IP Address (0.0.0.0/0 for dev).");
    } else {
      console.error(`👉 [Error Detail]: ${error.message}`);
    }

    throw error;
  }
};

module.exports = connectDB;
