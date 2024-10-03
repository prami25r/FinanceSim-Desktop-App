const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/financeSim', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  portfolio: {
    stocks: [Object],
    cryptos: [Object],
  },
  badges: [String],
});

const User = mongoose.model('User', UserSchema);

// Register user
app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({ username: req.body.username, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User registered');
});

// Login user
app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('User not found');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  const token = jwt.sign({ _id: user._id }, 'secretkey');
  res.header('auth-token', token).send(token);
});

// Fetch stock data
app.get('/stocks/:symbol', async (req, res) => {
  const stockData = await axios.get(`https://paper-api.alpaca.markets/v2/assets/${req.params.symbol}`);
  res.json(stockData.data);
});

// Fetch cryptocurrency data
app.get('/cryptos/:id', async (req, res) => {
  const cryptoData = await axios.get(`https://api.coingecko.com/api/v3/coins/${req.params.id}`);
  res.json(cryptoData.data);
});

app.listen(4000, () => console.log('Backend running on port 4000'));
