require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Food = require("./models/Food");
const Request = require("./models/Request");
const History = require("./models/History");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔐 REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).send("All fields required");

    const exist = await User.findOne({ email });
    if (exist) return res.send("User already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hash, role });
    await user.save();

    res.send("User Registered");
  } catch (err) {
    res.status(500).send("Error");
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Wrong password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.role });
  } catch {
    res.status(500).send("Error");
  }
});

// 🍱 ADD FOOD
app.post("/add", async (req, res) => {
  try {
    const { food, qty, location } = req.body;

    const newFood = new Food({
      food,
      qty,
      location,
      status: "available"
    });

    await newFood.save();
    res.send("Food Added");
  } catch {
    res.status(500).send("Error");
  }
});

// 📋 GET FOOD
app.get("/all", async (req, res) => {
  const data = await Food.find({ status: "available" });
  res.json(data);
});

// 🤝 REQUEST FOOD
app.post("/request", async (req, res) => {
  try {
    const newReq = new Request({
      ...req.body,
      status: "pending"
    });

    await newReq.save();
    res.send("Request Sent");
  } catch {
    res.status(500).send("Error");
  }
});

// 📋 GET REQUESTS
app.get("/requests", async (req, res) => {
  const data = await Request.find({ status: "pending" });
  res.json(data);
});

// ✅ CONFIRM REQUEST
app.post("/confirm", async (req, res) => {
  try {
    const reqData = req.body;

    const history = new History({
      ...reqData,
      status: "completed"
    });

    await history.save();

    await Request.deleteOne({ _id: reqData._id });

    await Food.updateOne(
      { _id: reqData.foodId },
      { status: "taken" }
    );

    res.send("Confirmed");
  } catch {
    res.status(500).send("Error");
  }
});

// 📦 HISTORY
app.get("/history", async (req, res) => {
  const data = await History.find();
  res.json(data);
});

// SERVER START
app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
