const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const USERS_FILE = path.join(__dirname, '../public/users.json');
const PRIZES_FILE = path.join(__dirname, '../public/prizes.json');

// Register User
app.post('/register', (req, res) => {
  const { name, mobile, area } = req.body;
  if (!name || !mobile || !area) {
    return res.json({ error: 'All fields are required' });
  }

  const id = 'USER' + Date.now();
  const newUser = { id, name, mobile, area };

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ id });
});

// Add Prize
app.post('/add-prize', (req, res) => {
  const { prize } = req.body;
  if (!prize) return res.json({ error: 'Prize is required' });

  let prizes = [];
  if (fs.existsSync(PRIZES_FILE)) {
    prizes = JSON.parse(fs.readFileSync(PRIZES_FILE));
  }
  prizes.push(prize);
  fs.writeFileSync(PRIZES_FILE, JSON.stringify(prizes, null, 2));

  res.json({ success: true });
});

// Get Prizes
app.get('/prizes', (req, res) => {
  if (fs.existsSync(PRIZES_FILE)) {
    const prizes = JSON.parse(fs.readFileSync(PRIZES_FILE));
    res.json(prizes);
  } else {
    res.json([]);
  }
});

// Generate Prize
app.get('/generate-prize', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const totalUsers = users.length;
  const otherPrizes = ["Travel Luggage Bag", "Hot Box", "Dinner Set"];
  let prize = "";

  if (totalUsers % 20 === 0) {
    prize = "5 grams Gold";
  } else {
    prize = otherPrizes[Math.floor(Math.random() * otherPrizes.length)];
  }

  res.json({ prize });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
