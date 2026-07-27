const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getAllUsers,
  setUserStatus,
  deleteUser,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private (any logged-in user)
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Admin only
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:id/status", protect, authorize("admin"), setUserStatus);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
