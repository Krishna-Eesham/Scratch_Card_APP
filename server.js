app.post("/register", (req, res) => {
  const newMember = req.body;

  if (!newMember.memberId || !newMember.schemeNumber) {
    return res.status(400).json({ error: "Invalid data. Member ID and Scheme Number are required." });
  }

  // Read the existing data from scratchcards.json
  let users;
  try {
    users = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    return res.status(500).json({ error: "Failed to read the users data." });
  }

  // Check if member already exists
  const existingMember = users.find((u) => u.memberId === newMember.memberId);
  if (existingMember) {
    return res.status(400).json({ error: "Member already registered." });
  }

  // Add the new member to the list
  users.push(newMember);

  // Assign a random prize to eligible members
  if (isEligibleForScratch(newMember.startDate, newMember.schemeNumber) && !newMember.prize) {
    newMember.prize = getRandomPrize(newMember.schemeNumber);
    console.log(`Assigned prize: ${newMember.prize} to member ${newMember.memberId}`);
  }

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
