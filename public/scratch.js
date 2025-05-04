// Get the member ID from URL query params (e.g., ?id=548147)
const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get("id");

if (!memberId) {
  alert("Member ID is missing in the URL.");
  window.location.href = "/"; // Redirect to the home page if no ID
}

// Fetch member details from the backend
fetch(`/member/${memberId}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.error) {
      alert(data.error);
      return;
    }

    if (!data.eligible) {
      // If the member is not eligible to scratch
      alert("You are not eligible to scratch at this time.");
      return;
    }

    // Show scratch card
    const scratchArea = document.getElementById("scratchArea");
    const scratchCanvas = document.getElementById("scratchCanvas");
    const prizeMessage = document.getElementById("prizeMessage");

    scratchArea.style.display = "block";
    prizeMessage.textContent = `Your prize is: ${data.prize}`;

    // Initialize scratch functionality
    const ctx = scratchCanvas.getContext("2d");

    // Set up canvas for scratch card
    ctx.fillStyle = "#888";
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Scratch to reveal your prize!", 50, 150);

    // Event listener for scratch functionality
    let isScratched = false;
    let isDrawing = false;

    scratchCanvas.addEventListener("mousedown", () => {
      isDrawing = true;
    });

    scratchCanvas.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    scratchCanvas.addEventListener("mousemove", (e) => {
      if (isDrawing) {
        const rect = scratchCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.clearRect(x - 20, y - 20, 40, 40); // Scratch effect

        // Check if the card is scratched enough
        const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const data = imageData.data;
        let scratchedPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
            scratchedPixels++;
          }
        }

        if (scratchedPixels / (scratchCanvas.width * scratchCanvas.height) > 0.7) {
          isScratched = true;
          // Unlock the prize
          prizeMessage.textContent = `Congratulations! Your prize is: ${data.prize}`;
          alert(`Congratulations! You have won: ${data.prize}`);
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching member data:", error);
    alert("There was an error fetching the member data.");
  });
