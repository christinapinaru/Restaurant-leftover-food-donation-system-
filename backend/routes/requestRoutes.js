const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  confirmRequest,
  getHistory,
} = require("../controllers/requestController");

router.post("/request", createRequest);
router.get("/requests", getRequests);
router.post("/confirm", confirmRequest);
router.get("/history", getHistory);

module.exports = router;