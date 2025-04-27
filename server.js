const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'public', 'users.json');
const PRIZES_FILE = path.join(__dirname, 'public', 'prizes.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Allow CORS (optional but good if needed for APIs)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 📌 Register new user
app.post('/register', (req, res) => {
  const { name, mobile, area } = req.body;
  if (!name || !mobile || !area) {
    return res.status(400).json({ error: 'Name, Mobile, and Area are required' });
  }

  const id = 'USER' + Math.floor(100000 + Math.random() * 900000); // 6-digit ID

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  users.push({ id, name, mobile, area });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  console.log(`✅ User registered: ${id} - ${name} - ${mobile} - ${area}`);
  res.json({ id });
});

// 📌 Add a prize
app.post('/add-prize', (req, res) => {
  const { prize } = req.body;
  if (!prize) {
    return res.status(400).json({ error: 'Prize is required' });
  }

  let prizes = [];
  if (fs.existsSync(PRIZES_FILE)) {
    prizes = JSON.parse(fs.readFileSync(PRIZES_FILE, 'utf-8'));
  }

  prizes.push(prize);
  fs.writeFileSync(PRIZES_FILE, JSON.stringify(prizes, null, 2));

  console.log(`🎁 Prize added: ${prize}`);
  res.json({ success: true });
});

// 📌 Get all prizes
app.get('/prizes', (req, res) => {
  let prizes = [];
  if (fs.existsSync(PRIZES_FILE)) {
    prizes = JSON.parse(fs.readFileSync(PRIZES_FILE, 'utf-8'));
  }
  res.json(prizes);
});

// 📌 Generate random prize for a user
app.get('/generate-prize', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  let prizes = [];
  if (fs.existsSync(PRIZES_FILE)) {
    prizes = JSON.parse(fs.readFileSync(PRIZES_FILE, 'utf-8'));
  }

  if (prizes.length === 0) {
    return res.status(400).json({ error: 'No prizes defined yet!' });
  }

  // Special logic: 1 in every 20 users wins "5 grams gold"
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  let assignedPrize = '';
  if ((userIndex + 1) % 20 === 0) {
    assignedPrize = "5 grams gold";
  } else {
    // Random from other prizes
    const filteredPrizes = prizes.filter(p => p !== "5 grams gold");
    assignedPrize = filteredPrizes[Math.floor(Math.random() * filteredPrizes.length)];
  }

  console.log(`🎯 Prize generated for ${userId}: ${assignedPrize}`);
  res.json({ prize: assignedPrize });
});

// 📌 Serve scratch page manually
app.get('/scratch.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scratch.html'));
});

// ✅ Start server — listen on 0.0.0.0 (important for mobile access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Access via your IP on mobile: http://<your-ip>:${PORT}`);
});
