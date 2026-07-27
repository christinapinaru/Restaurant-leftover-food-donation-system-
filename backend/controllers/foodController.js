const Food = require("../models/Food");
const Request = require("../models/Request");

// @desc    Create a new leftover food listing
// @route   POST /api/food
// @access  Private/Restaurant
const createFood = async (req, res, next) => {
  try {
    const {
      foodName,
      description,
      quantity,
      unit,
      foodType,
      pickupAddress,
      expiryTime,
      imageUrl,
    } = req.body;

    if (!foodName || !quantity || !pickupAddress || !expiryTime) {
      return res.status(400).json({
        message:
          "foodName, quantity, pickupAddress and expiryTime are required",
      });
    }

    const food = await Food.create({
      foodName,
      description,
      quantity,
      unit,
      foodType,
      pickupAddress,
      expiryTime,
      imageUrl,
      restaurant: req.user._id,
    });

    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food listings (with optional status filter)
//          Receivers/Admin see all; restaurants can filter to "mine=true"
// @route   GET /api/food
// @access  Private
const getAllFood = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.mine === "true") filter.restaurant = req.user._id;

    const foods = await Food.find(filter)
      .populate("restaurant", "name organizationName phone address")
      .sort({ createdAt: -1 });

    // Auto-mark expired listings
    const updates = foods
      .filter((f) => f.status === "available" && f.expiryTime < new Date())
      .map((f) => {
        f.status = "expired";
        return f.save();
      });
    if (updates.length) await Promise.all(updates);

    res.json(foods);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food listing
// @route   GET /api/food/:id
// @access  Private
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "restaurant",
      "name organizationName phone address"
    );

    if (!food) return res.status(404).json({ message: "Food listing not found" });

    res.json(food);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a food listing (owner restaurant only)
// @route   PUT /api/food/:id
// @access  Private/Restaurant (owner)
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food listing not found" });

    if (
      food.restaurant.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    const allowedFields = [
      "foodName",
      "description",
      "quantity",
      "unit",
      "foodType",
      "pickupAddress",
      "expiryTime",
      "status",
      "imageUrl",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) food[field] = req.body[field];
    });

    const updated = await food.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a food listing (owner restaurant or admin)
// @route   DELETE /api/food/:id
// @access  Private/Restaurant (owner) or Admin
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food listing not found" });

    if (
      food.restaurant.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    await Request.deleteMany({ food: food._id });
    await food.deleteOne();

    res.json({ message: "Food listing removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
};
