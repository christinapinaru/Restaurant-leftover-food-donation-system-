const express = require("express");
const router = express.Router();
const {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, authorize("restaurant"), createFood)
  .get(protect, getAllFood);

router
  .route("/:id")
  .get(protect, getFoodById)
  .put(protect, authorize("restaurant", "admin"), updateFood)
  .delete(protect, authorize("restaurant", "admin"), deleteFood);

module.exports = router;
