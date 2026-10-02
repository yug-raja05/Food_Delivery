const express = require("express");
const router = express.Router();
const { getRestaurantInfo } = require("../controllers/restaurantController");

router.get("/", getRestaurantInfo);

module.exports = router;
