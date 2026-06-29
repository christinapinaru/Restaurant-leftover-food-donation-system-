const Food = require("../models/Food");

const addFood = async (req, res) => {
  const { food, qty } = req.body;

  try {
    const newFood = new Food({
      food,
      qty,
    });

    await newFood.save();

    res.json({
      message: "Food added successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: "Could not add food",
    });
  }
};


const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({
      createdAt: -1,
    });

    res.json(foods);

  } catch (error) {
    res.status(500).json({
      error: "Could not fetch foods",
    });
  }
};


module.exports = {
  addFood,
  getFoods,
};