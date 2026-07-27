const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
<<<<<<< HEAD
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
=======
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
