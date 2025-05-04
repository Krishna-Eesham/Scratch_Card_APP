async function startScratch() {
  const memberId = document.getElementById('memberId').value.trim();

  if (!memberId) {
    alert('Please enter your Member ID');
    return;
  }

  try {
    // ✅ Replace with your actual Google Apps Script Web App URL
const response = await fetch('https://script.google.com/macros/s/AKfycby7jNBL9onO4PccM49102DFYqC9bcJ5DdJbBpzEa0Gl06TUsQUwuDL8vsXbYeOsEtqEPw/exec');
const users = await response.json();

console.log("Fetched users:", users); // ✅ Inspect this
console.log("Entered Member ID:", memberId); // ✅ Inspect this

const user = users.find(u => (u['Member ID'] || '').trim() === memberId);


    if (!user) {
      alert('Invalid Member ID');
      return;
    }

    // Compute end date using Scheme Start Date + Scratch Card Days
    const startDate = new Date(user['Scheme Start Date']);
    const scratchDays = parseInt(user['Scratch Card Days'], 10);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + scratchDays);

    const today = new Date();
    if (today < endDate) {
      alert(`You can scratch only after your scheme ends on ${endDate.toDateString()}`);
      return;
    }

    // Optionally check if already scratched (requires backend support)
    if (user['Scratched'] === 'TRUE') {
      alert(`You have already scratched and won: ${user['Prize'] || 'a reward!'}`);
      return;
    }

    // Show the scratch area and initialize
    document.getElementById('scratchArea').style.display = 'block';

    // Normalize user object for use in scratch logic
    const userData = {
      memberId: user['Member ID'],
      name: user['Name'],
      mobile: user['Mobile Number'],
      startDate: startDate.toISOString().split('T')[0],
      isScratched: false,
      prize: user['Prize'] || null
    };

    initScratch(userData);

  } catch (err) {
    console.error('Error fetching user data:', err);
    alert('Unable to connect to server. Please try again later.');
  }
}


function initScratch(user) {
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  let isDrawing = false;

  const prize = user['Prize'] ? user['Prize'] : "🎁 Surprise 🎁";

  // Draw prize text
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 22px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(prize, canvas.width / 2, canvas.height / 2);

  // Silver overlay
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'silver';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText("Scratch Me!", canvas.width / 2, canvas.height / 2);

  // Scratch logic
  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  });
}
