// Required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'public', 'scratchcards.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dummy functions if not defined
function isEligibleForScratch(date, scheme) {
  return true; // Replace with real logic
}
function getRandomPrize(scheme) {
  return "Gift Voucher"; // Replace with real logic
}

// Your POST /register logic here...

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
