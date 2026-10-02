const Coupon = require("../models/Coupon");

// @desc    Validate a coupon code and calculate discount
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a coupon code to validate"
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code. Try ZION50 or WELCOME10."
      });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This coupon code has expired."
      });
    }

    const numSubtotal = Number(subtotal) || 0;
    if (coupon.minOrder && numSubtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order subtotal of ₹${coupon.minOrder}.`
      });
    }

    let discount = 0;
    if (coupon.discountType === "fixed") {
      discount = Math.min(coupon.value, numSubtotal);
    } else if (coupon.discountType === "percent") {
      discount = Math.round((numSubtotal * (coupon.value / 100)) * 100) / 100;
    }

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        minOrder: coupon.minOrder,
        description: coupon.description,
        discount: discount
      }
    });
  } catch (error) {
    next(error);
  }
};
