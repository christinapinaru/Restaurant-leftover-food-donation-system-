const express = require("express");
const router = express.Router();
const {
  addFood,
  getFoods,
} = require("../controllers/foodController");

router.post("/add", addFood);
router.get("/all", getFoods);

module.exports = router;