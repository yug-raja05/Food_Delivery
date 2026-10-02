const Restaurant = require("../models/Restaurant");

// @desc    Get restaurant details
// @route   GET /api/restaurant
// @access  Public
exports.getRestaurantInfo = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      // Fallback default info if not yet seeded
      restaurant = {
        name: "Zion Food Corner",
        category: "Fast Food",
        rating: 5.0,
        reviewCount: 3,
        phone: "098867 64280",
        rawPhone: "09886764280",
        status: "Open Now",
        statusHours: "11:00 AM - 11:00 PM",
        statusNote: "Open daily for dine-in, takeaway, and fast home delivery!",
        address: {
          line1: "45, 4th Main Rd, Corporation",
          line2: "Ashwath Nagar, Sampangi Rama Nagara",
          area: "S R Nagar, Bengaluru",
          stateAndZip: "Karnataka 560027",
          full: "45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru, Karnataka 560027"
        },
        googleMapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027",
        aboutText:
          "Zion Food Corner is a local fast-food restaurant serving affordable Indian favourites including biryani, fried rice, noodles, chicken dishes and vegetarian dishes.",
        subtitle: "Delicious Food at Affordable Prices",
        heroDescription:
          "Enjoy delicious biryani, fried rice, noodles, chicken dishes, and popular Indian favourites at affordable prices."
      };
    }
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
