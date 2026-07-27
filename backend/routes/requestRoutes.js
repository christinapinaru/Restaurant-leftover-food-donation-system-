const express = require("express");
const router = express.Router();
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
