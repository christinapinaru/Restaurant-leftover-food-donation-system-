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
  }
};

module.exports = {
  registerUser,
  loginUser,
};