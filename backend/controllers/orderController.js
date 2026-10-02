const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Coupon = require("../models/Coupon");
const generateOrderId = require("../utils/generateOrderId");

// @desc    Create a new validated restaurant order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      orderType = "takeaway",
      deliveryAddress,
      tableNumber,
      items,
      cookingInstructions = "",
      couponCode = "",
      paymentMethod = "cod"
    } = req.body;

    // 1. Validate Customer
    if (!customer || !customer.name || !customer.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required"
      });
    }

    if (!customer.phone || !customer.phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer contact phone number is required"
      });
    }

    // 2. Validate Order Type Specifics
    if (!["takeaway", "delivery", "dinein"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order type. Must be 'takeaway', 'delivery', or 'dinein'"
      });
    }

    if (orderType === "delivery") {
      if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.address.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please enter your delivery address"
        });
      }
    } else if (orderType === "dinein") {
      if (!tableNumber || Number(tableNumber) < 1) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid table number for dine-in service"
        });
      }
    }

    // 3. Validate Cart Items Array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your food cart is empty. Please add items to place an order."
      });
    }

    // 4. Retrieve Source-of-Truth Prices from MongoDB
    const validatedItems = [];
    let subtotal = 0;

    for (const clientItem of items) {
      const requestedId = clientItem.id || clientItem.menuItemId || clientItem._id;
      const qty = Math.max(1, parseInt(clientItem.quantity, 10) || 1);

      let dbItem = null;
      if (!isNaN(Number(requestedId))) {
        dbItem = await MenuItem.findOne({ id: Number(requestedId) });
      }
      if (!dbItem && String(requestedId).match(/^[0-9a-fA-F]{24}$/)) {
        dbItem = await MenuItem.findById(requestedId);
      }

      if (!dbItem || !dbItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Dish "${clientItem.name || requestedId}" is currently unavailable or invalid.`
        });
      }

      const itemPrice = Number(dbItem.price) || 0;
      const itemSubtotal = Math.round(itemPrice * qty * 100) / 100;
      subtotal += itemSubtotal;

      validatedItems.push({
        menuItemId: dbItem.id || dbItem._id,
        name: dbItem.name,
        price: itemPrice,
        quantity: qty,
        image: dbItem.image || "",
        subtotal: itemSubtotal
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // 5. Validate and Apply Coupon Server-Side
    let discount = 0;
    let verifiedCouponCode = "";

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

      if (coupon) {
        const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
        const meetsMinOrder = !coupon.minOrder || subtotal >= coupon.minOrder;

        if (!isExpired && meetsMinOrder) {
          verifiedCouponCode = coupon.code;
          if (coupon.discountType === "fixed") {
            discount = Math.min(coupon.value, subtotal);
          } else if (coupon.discountType === "percent") {
            discount = Math.round((subtotal * (coupon.value / 100)) * 100) / 100;
          }
        }
      }
    }

    // 6. Calculate Fees and Taxes
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const packagingFee = subtotal > 0 ? 15 : 0;
    const deliveryFee =
      orderType === "delivery"
        ? subtotal >= 250
          ? 0
          : 25
        : 0;

    const grandTotal = Math.max(
      0,
      Math.round((subtotal + tax + packagingFee + deliveryFee - discount) * 100) / 100
    );

    // 7. Generate Safe Order ID
    const orderNumber = generateOrderId();

    // 8. Payment Status
    const paymentStatus = paymentMethod === "cod" ? "cod" : "pending";

    // 9. Save Order to MongoDB
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim()
      },
      orderType,
      deliveryAddress:
        orderType === "delivery"
          ? {
              address: deliveryAddress.address.trim(),
              landmark: (deliveryAddress.landmark || "").trim(),
              pincode: (deliveryAddress.pincode || "560027").trim()
            }
          : undefined,
      tableNumber: orderType === "dinein" ? Number(tableNumber) : undefined,
      items: validatedItems,
      cookingInstructions: (cookingInstructions || "").trim(),
      couponCode: verifiedCouponCode,
      subtotal,
      tax,
      deliveryFee,
      packagingFee,
      discount,
      grandTotal,
      paymentMethod: ["cod", "upi"].includes(paymentMethod) ? paymentMethod : "cod",
      paymentStatus,
      orderStatus: "confirmed"
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Kitchen has received your order.",
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/:orderNumber
// @access  Public
exports.getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber: orderNumber.trim() });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderNumber} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:orderNumber/status
// @access  Public (or Admin in future)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: orderNumber.trim() },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderNumber} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
