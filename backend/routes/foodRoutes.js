const express = require("express");
const router = express.Router();
const {
<<<<<<< HEAD
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
=======
  addFood,
  getFoods,
} = require("../controllers/foodController");

router.post("/add", addFood);
router.get("/all", getFoods);

module.exports = router;
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
