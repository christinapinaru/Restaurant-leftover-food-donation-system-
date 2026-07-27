const Request = require("../models/Request");
<<<<<<< HEAD
const Food = require("../models/Food");

// @desc    Create a request for a food listing
// @route   POST /api/requests
// @access  Private/Receiver
const createRequest = async (req, res, next) => {
  try {
    const { foodId, message } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food listing not found" });

    if (food.status !== "available") {
      return res
        .status(400)
        .json({ message: `This food listing is not available (status: ${food.status})` });
    }

    const existing = await Request.findOne({
      food: foodId,
      receiver: req.user._id,
      status: { $in: ["pending", "accepted"] },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already have an active request for this food" });
    }

    const request = await Request.create({
      food: foodId,
      receiver: req.user._id,
      restaurant: food.restaurant,
      message: message || "",
    });

    const populated = await request.populate([
      { path: "food" },
      { path: "receiver", select: "name organizationName phone" },
      { path: "restaurant", select: "name organizationName phone" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests made by the logged-in receiver
// @route   GET /api/requests/my
// @access  Private/Receiver
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiver: req.user._id })
      .populate("food")
      .populate("restaurant", "name organizationName phone address")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests received by the logged-in restaurant
// @route   GET /api/requests/received
// @access  Private/Restaurant
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ restaurant: req.user._id })
      .populate("food")
      .populate("receiver", "name organizationName phone address")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a request's status (accept / reject / complete / cancel)
// @route   PUT /api/requests/:id/status
// @access  Private/Restaurant (owner) or Receiver (cancel only) or Admin
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["accepted", "rejected", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isOwnerRestaurant =
      request.restaurant.toString() === req.user._id.toString();
    const isRequester = request.receiver.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (["accepted", "rejected", "completed"].includes(status)) {
      if (!isOwnerRestaurant && !isAdmin) {
        return res
          .status(403)
          .json({ message: "Only the restaurant can accept/reject/complete a request" });
      }
    }

    if (status === "cancelled") {
      if (!isRequester && !isAdmin) {
        return res
          .status(403)
          .json({ message: "Only the requester can cancel their own request" });
      }
    }

    request.status = status;
    await request.save();

    // Keep the Food listing status in sync
    const food = await Food.findById(request.food._id || request.food);
    if (food) {
      if (status === "accepted") food.status = "requested";
      if (status === "completed") food.status = "completed";
      if (status === "rejected" || status === "cancelled") food.status = "available";
      await food.save();
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests (admin overview)
// @route   GET /api/requests
// @access  Private/Admin
const getAllRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await Request.find(filter)
      .populate("food")
      .populate("receiver", "name organizationName phone")
      .populate("restaurant", "name organizationName phone")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  getAllRequests,
};
=======

const createRequest = async (req, res) => {
  const { food, qty, user } = req.body;

  try {
    const request = new Request({
      food,
      qty,
      user,
    });

    await request.save();

    res.json({
      message: "Request submitted",
    });

  } catch (error) {
    res.status(500).json({
      error: "Request failed",
    });
  }
};


const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({
      createdAt: -1,
    });

    res.json(requests);

  } catch (error) {
    res.status(500).json({
      error: "Could not fetch requests",
    });
  }
};


const confirmRequest = async (req, res) => {
  const { id } = req.body;

  try {
    await Request.findByIdAndUpdate(id, {
      status: "confirmed",
    });

    res.json({
      message: "Request confirmed",
    });

  } catch (error) {
    res.status(500).json({
      error: "Confirmation failed",
    });
  }
};


const getHistory = async (req, res) => {
  try {
    const history = await Request.find({
      status: "confirmed",
    });

    res.json(history);

  } catch (error) {
    res.status(500).json({
      error: "Could not load history",
    });
  }
};


module.exports = {
  createRequest,
  getRequests,
  confirmRequest,
  getHistory,
};
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
