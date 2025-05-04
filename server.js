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

// POST /register route
app.post("/register", (req, res) => {
  const newMember = req.body;

  if (!newMember.memberId || !newMember.schemeNumber) {
    return res.status(400).json({ error: "Invalid data. Member ID and Scheme Number are required." });
  }

  // Read the existing data from scratchcards.json
  let users = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      users = data ? JSON.parse(data) : [];
    }
  } catch (err) {
    console.error("Failed to read the users data:", err);
    return res.status(500).json({ error: "Failed to read the users data." });
  }

  // Check if member already exists
  const existingMember = users.find((u) => u.memberId === newMember.memberId);
  if (existingMember) {
    return res.status(400).json({ error: "Member already registered." });
  }

  // Assign a random prize to eligible members
  if (isEligibleForScratch(newMember.startDate, newMember.schemeNumber) && !newMember.prize) {
    newMember.prize = getRandomPrize(newMember.schemeNumber);
    console.log(`Assigned prize: ${newMember.prize} to member ${newMember.memberId}`);
  }

  // Add the new member to the list
  users.push(newMember);

  // Save the updated data back to scratchcards.json
  fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Failed to write to file." });
    }
    console.log("✅ scratchcards.json updated successfully.");
    res.json({ message: "Member registered and scratchcards.json updated successfully." });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
