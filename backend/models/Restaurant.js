const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
      default: "Zion Food Corner"
    },
    category: {
      type: String,
      default: "Fast Food"
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewCount: {
      type: Number,
      default: 3
    },
    phone: {
      type: String,
      default: "098867 64280"
    },
    rawPhone: {
      type: String,
      default: "09886764280"
    },
    status: {
      type: String,
      default: "Open Now"
    },
    statusHours: {
      type: String,
      default: "11:00 AM - 11:00 PM"
    },
    statusNote: {
      type: String,
      default: "Open daily for dine-in, takeaway, and fast home delivery!"
    },
    address: {
      line1: { type: String, default: "45, 4th Main Rd, Corporation" },
      line2: { type: String, default: "Ashwath Nagar, Sampangi Rama Nagara" },
      area: { type: String, default: "S R Nagar, Bengaluru" },
      stateAndZip: { type: String, default: "Karnataka 560027" },
      full: {
        type: String,
        default: "45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru, Karnataka 560027"
      }
    },
    googleMapsUrl: {
      type: String,
      default:
        "https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027"
    },
    aboutText: {
      type: String,
      default:
        "Zion Food Corner is a local fast-food restaurant serving affordable Indian favourites including biryani, fried rice, noodles, chicken dishes and vegetarian dishes."
    },
    subtitle: {
      type: String,
      default: "Delicious Food at Affordable Prices"
    },
    heroDescription: {
      type: String,
      default:
        "Enjoy delicious biryani, fried rice, noodles, chicken dishes, and popular Indian favourites at affordable prices."
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
