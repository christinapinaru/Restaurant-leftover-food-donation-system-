const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },

  qty: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Food", foodSchema);