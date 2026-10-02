const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByNumber,
  updateOrderStatus
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:orderNumber", getOrderByNumber);
router.patch("/:orderNumber/status", updateOrderStatus);

module.exports = router;
