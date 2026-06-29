const Request = require("../models/Request");

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