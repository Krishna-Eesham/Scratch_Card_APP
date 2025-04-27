// Register User
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const mobile = document.getElementById('mobile').value;
  const area = document.getElementById('Area').value;

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, area })
  });

  const data = await res.json();
  if (data.error) {
    document.getElementById('register-result').innerText = `Error: ${data.error}`;
  } else {
    document.getElementById('register-result').innerText = `✅ User Registered! ID = ${data.id}`;
  }
});

// Add Prize
document.getElementById('prize-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prize = document.getElementById('prize').value;

  const res = await fetch('/add-prize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prize })
  });

  const data = await res.json();
  if (!data.error) {
    document.getElementById('prize').value = '';
    loadPrizes();
  }
});

// Load Prizes
async function loadPrizes() {
  const res = await fetch('/prizes');
  const prizes = await res.json();
  document.getElementById('prize-list').innerHTML =
    '<h4>Current Prizes:</h4>' +
    prizes.map(p => `<div>🎁 ${p}</div>`).join('');
}
loadPrizes();

// Generate Scratch Card
document.getElementById('scratch-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('user-id').value;

  const res = await fetch(`/generate-prize?userId=${userId}`);
  const data = await res.json();

  if (data.error) {
    document.getElementById('scratch-result').innerText = `Error: ${data.error}`;
  } else {
    const scratchLink = `${window.location.origin}/scratch.html?id=${userId}&prize=${encodeURIComponent(data.prize)}`;
    const whatsAppLink = `https://wa.me/?text=Check out your scratch card! ${encodeURIComponent(scratchLink)}`;
    
    document.getElementById('scratch-result').innerHTML = `
      <p>Scratch Card Link:</p>
      <a href="${scratchLink}" target="_blank">${scratchLink}</a>
      <br><br>
      <a href="${whatsAppLink}" target="_blank">Share on WhatsApp</a>
    `;
  }
});
