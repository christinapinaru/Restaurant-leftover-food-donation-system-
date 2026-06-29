const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  food: String,

  qty: String,

  user: String,

  status: {
    type: String,
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema);