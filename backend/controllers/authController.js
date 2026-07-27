<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new user (admin, restaurant, or receiver)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address, organizationName } =
      req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Only allow "admin" role creation if no admin secret matches
    // (basic protection so random users can't self-register as admin)
    let assignedRole = "receiver";
    if (role === "restaurant" || role === "receiver") {
      assignedRole = role;
    } else if (role === "admin") {
      if (req.body.adminSecret !== process.env.JWT_SECRET) {
        return res
          .status(403)
          .json({ message: "Not authorized to create an admin account" });
      }
      assignedRole = "admin";
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      address,
      organizationName,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    ["name", "phone", "address", "organizationName"].forEach((field) => {
      if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Activate / deactivate a user (admin only)
// @route   PUT /api/auth/users/:id/status
// @access  Private/Admin
const setUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed" });
  } catch (error) {
    next(error);
=======
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Register User
// =======================

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Only donor and recipient can register
    if (role !== "donor" && role !== "recipient") {
      return res.status(400).json({
        error: "Only Donor and Recipient can register",
      });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

// =======================
// Login User
// =======================

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // Check Password
    const checkPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Return User Info
    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      error: "Login failed",
    });
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
  }
};

module.exports = {
  registerUser,
  loginUser,
<<<<<<< HEAD
  getMe,
  updateMe,
  getAllUsers,
  setUserStatus,
  deleteUser,
};
=======
};
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
