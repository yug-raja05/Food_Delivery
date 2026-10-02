const express = require("express");
const router = express.Router();
const {
  getMenu,
  getMenuItemById,
  getMenuByCategory,
  getPopularItems,
  searchMenu
} = require("../controllers/menuController");

router.get("/", getMenu);
router.get("/popular", getPopularItems);
router.get("/search", searchMenu);
router.get("/category/:category", getMenuByCategory);
router.get("/:id", getMenuItemById);

module.exports = router;
