const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  food: String,
  qty: String,
  user: { type: String, default: 'Guest' },
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);