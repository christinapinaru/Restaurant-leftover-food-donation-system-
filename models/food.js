const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  food: String,
  qty: String,
  location: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Food", foodSchema);