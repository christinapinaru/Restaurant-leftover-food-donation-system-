require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Food = require('./models/food');
const Request = require('./models/request');
const History = require('./models/history');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/fooddonation';
let dbReady = false;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
const fallbackFoods = [];
const fallbackRequests = [];
const fallbackHistory = [];
const fallbackUsers = [];

mongoose
  .connect(MONGO_URL)
  .then(() => {
    dbReady = true;
    console.log('MongoDB Connected');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.warn('Running with in-memory fallback storage.');
  });

app.get('/all', async (req, res) => {
  try {
    if (dbReady) {
      const foods = await Food.find({ status: 'available' }).sort({ createdAt: -1 });
      return res.json(foods);
    }
    return res.json(fallbackFoods);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch food items.' });
  }
});

app.post('/add', authenticateToken, async (req, res) => {
  const { food, qty, location } = req.body;
  if (!food || !qty) {
    return res.status(400).json({ error: 'Food name and quantity are required.' });
  }

  try {
    const item = {
      food,
      qty,
      location: location || '',
      status: 'available',
      createdAt: new Date(),
    };

    if (dbReady) {
      const newFood = await Food.create(item);
      return res.json(newFood);
    }

    fallbackFoods.unshift(item);
    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add food.' });
  }
});

app.post('/request', authenticateToken, async (req, res) => {
  const { food, qty, user } = req.body;
  if (!food || !qty) {
    return res.status(400).json({ error: 'Food name and quantity are required.' });
  }

  try {
    const requestData = {
      food,
      qty,
      user: user || 'Guest',
      status: 'pending',
      createdAt: new Date(),
    };

    if (dbReady) {
      const newRequest = await Request.create(requestData);
      return res.json(newRequest);
    }

    fallbackRequests.unshift(requestData);
    return res.json(requestData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create request.' });
  }
});

app.get('/requests', async (req, res) => {
  try {
    if (dbReady) {
      const requests = await Request.find({ status: 'pending' }).sort({ createdAt: -1 });
      return res.json(requests);
    }
    return res.json(fallbackRequests);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch requests.' });
  }
});

app.post('/confirm', authenticateToken, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Request id is required.' });
  }

  try {
    if (dbReady) {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found.' });
      }

      request.status = 'confirmed';
      await request.save();

      const historyData = await History.create({
        food: request.food,
        qty: request.qty,
        status: 'completed',
        createdAt: new Date(),
      });

      return res.json({ request, history: historyData });
    }

    const request = fallbackRequests.find((item) => item.id === id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    request.status = 'confirmed';
    const historyRecord = {
      ...request,
      status: 'completed',
      createdAt: new Date(),
    };
    fallbackHistory.unshift(historyRecord);
    return res.json({ request, history: historyRecord });
  } catch (error) {
    res.status(500).json({ error: 'Unable to confirm request.' });
  }
});

app.get('/history', async (req, res) => {
  try {
    if (dbReady) {
      const history = await History.find().sort({ createdAt: -1 });
      return res.json(history);
    }
    return res.json(fallbackHistory);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch history.' });
  }
});

app.get('/health', async (req, res) => {
  try {
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const mongoState = stateMap[mongoose.connection.readyState] || 'unknown';
    const foodCount = dbReady ? await Food.countDocuments() : fallbackFoods.length;
    const requestCount = dbReady ? await Request.countDocuments() : fallbackRequests.length;
    const historyCount = dbReady ? await History.countDocuments() : fallbackHistory.length;

    return res.json({
      status: 'ok',
      dbReady,
      mongoState,
      foodCount,
      requestCount,
      historyCount,
      backupStorage: !dbReady,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to check health.', details: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    if (dbReady) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
    } else {
      const existingUser = fallbackUsers.find((user) => user.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      fallbackUsers.push({ id: String(Date.now()), name, email, password: hashedPassword });
    }

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    let user;
    if (dbReady) {
      user = await User.findOne({ email });
    } else {
      user = fallbackUsers.find((item) => item.email === email);
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id || user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id || user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
