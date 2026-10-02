const MenuItem = require("../models/MenuItem");

// @desc    Get all menu items (with optional filters)
// @route   GET /api/menu
// @access  Public
exports.getMenu = async (req, res, next) => {
  try {
    const { category, isVeg, search, popular } = req.query;
    const query = { isAvailable: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (isVeg !== undefined) {
      if (isVeg === "true" || isVeg === true) query.isVeg = true;
      else if (isVeg === "false" || isVeg === false) query.isVeg = false;
    }

    if (popular !== undefined) {
      if (popular === "true" || popular === true) query.isPopular = true;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { categoryLabel: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ];
    }

    const items = await MenuItem.find(query).sort({ id: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = async (req, res, next) => {
  try {
    const param = req.params.id;
    let item = null;

    if (!isNaN(Number(param))) {
      item = await MenuItem.findOne({ id: Number(param) });
    }

    if (!item && param.match(/^[0-9a-fA-F]{24}$/)) {
      item = await MenuItem.findById(param);
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item not found with identifier: ${param}`
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get menu items by category slug
// @route   GET /api/menu/category/:category
// @access  Public
exports.getMenuByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const query = { isAvailable: true };
    if (category !== "all") {
      query.category = category;
    }

    const items = await MenuItem.find(query).sort({ id: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular / bestseller menu items
// @route   GET /api/menu/popular
// @access  Public
exports.getPopularItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ isPopular: true, isAvailable: true }).sort({ id: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search menu items
// @route   GET /api/menu/search
// @access  Public
exports.searchMenu = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) {
      const items = await MenuItem.find({ isAvailable: true }).sort({ id: 1 });
      return res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    }

    const items = await MenuItem.find({
      isAvailable: true,
      $or: [
        { name: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
        { categoryLabel: { $regex: q.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(q.trim(), "i")] } }
      ]
    }).sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};
