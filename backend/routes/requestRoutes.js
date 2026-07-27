const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  getAllRequests,
} = require("../controllers/requestController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("receiver"), createRequest);
router.get("/my", protect, authorize("receiver"), getMyRequests);
router.get("/received", protect, authorize("restaurant"), getReceivedRequests);
router.get("/", protect, authorize("admin"), getAllRequests);
router.put("/:id/status", protect, updateRequestStatus);

module.exports = router;
=======

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
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
