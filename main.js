// public/main.js
const backendUrl = "https://scratch-card-app.onrender.com"; // your deployed backend URL

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const mobile = document.getElementById('mobile').value;
  const area = document.getElementById('area').value;

  const res = await fetch(`${backendUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, area })
  });

  const data = await res.json();
  alert('Registered! User ID: ' + data.id);
});

document.getElementById('prize-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prize = document.getElementById('prize').value;

  const res = await fetch(`${backendUrl}/add-prize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prize })
  });

  const data = await res.json();
  alert('Prize Added Successfully!');
});

document.getElementById('generate-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('gen-userid').value;

  const res = await fetch(`${backendUrl}/generate-prize?userId=${userId}`);
  const data = await res.json();

  if (data.prize) {
    window.location.href = `scratch.html?id=${userId}&prize=${encodeURIComponent(data.prize)}`;
  } else {
    alert('Error generating prize!');
  }
});