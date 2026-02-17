const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dashboard_db';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const recentActivities = [
  'Admin logged in',
  'New user registered',
  'Task status updated',
  'Monthly report generated'
];

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    res.render('dashboard', {
      totalUsers: users.length,
      pendingTasks: 7,
      recentActivities,
      users
    });
  } catch (error) {
    next(error);
  }
});

app.post('/users', async (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.redirect('/dashboard');
  }

  try {
    await User.create({ name, email, role });
    res.redirect('/dashboard');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send('Email already exists. Please use a different email.');
    }

    next(error);
  }
});

app.post('/users/:id/update', async (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.redirect('/dashboard');
  }

  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { runValidators: true }
    );

    res.redirect('/dashboard');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send('Email already exists. Please use a different email.');
    }

    next(error);
  }
});

app.post('/users/:id/delete', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Something went wrong. Please try again.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
