const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    unit: {
      type: String,
      enum: ["kg", "plates", "packets", "liters", "boxes"],
      default: "plates",
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "mixed"],
      default: "veg",
    },
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"],
    },
    expiryTime: {
      // last safe time this food can be picked up / consumed
      type: Date,
      required: [true, "Expiry / best-before time is required"],
    },
    status: {
      type: String,
      enum: ["available", "requested", "completed", "expired", "cancelled"],
      default: "available",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-expire listings whose expiryTime has passed and are still available
foodSchema.methods.checkExpiry = function () {
  if (this.status === "available" && this.expiryTime < new Date()) {
    this.status = "expired";
  }
  return this;
};

module.exports = mongoose.model("Food", foodSchema);