window.addEventListener('load', () => {
  const canvas = document.getElementById('cloudCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0f0c29");
  gradient.addColorStop(0.5, "#302b63");
  gradient.addColorStop(1, "#24243e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let giraffes = [];
  const giraffeImage = new Image();
  giraffeImage.src = 'giraffe.png'; // Ensure this file exists in your project directory

  const sunglassesImage = new Image();
  sunglassesImage.src = 'sunglasses.png'; // Ensure this file exists in your project directory

  const mouse = { x: 0, y: 0 }; // Track mouse position
  let confetti = []; // Array to store confetti particles
  let gameWon = false; // Track if the game is won

  // Create giraffe objects with random properties
  for (let i = 0; i < 10; i++) {
    giraffes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 50 + Math.random() * 30, // Random width
      speed: 0.5 + Math.random() * 0.8,
      angle: Math.random() * Math.PI * 2, // Random initial angle
      rotationSpeed: 0.01 + Math.random() * 0.05, // Random rotation speed
    });
  }

  function drawGiraffe(giraffe) {
    const aspectRatio = giraffeImage.width / giraffeImage.height;
    const height = giraffe.width / aspectRatio;

    // Save the current canvas state
    ctx.save();

    // Move to the giraffe's center and rotate
    ctx.translate(giraffe.x + giraffe.width / 2, giraffe.y + height / 2);
    ctx.rotate(giraffe.angle);

    // Draw the giraffe image
    ctx.drawImage(
      giraffeImage,
      -giraffe.width / 2,
      -height / 2,
      giraffe.width,
      height
    );

    // Draw the sunglasses on top of the giraffe
    const sunglassesWidth = giraffe.width * 0.6; // Adjust size of sunglasses
    const sunglassesHeight = sunglassesWidth / 2; // Maintain aspect ratio
    ctx.drawImage(
      sunglassesImage,
      -sunglassesWidth / 2,
      -height / 3, // Position sunglasses near the top of the giraffe
      sunglassesWidth,
      sunglassesHeight
    );

    // Restore the canvas state
    ctx.restore();
  }

  function drawGoals() {
    // Left goal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, canvas.height / 3, 50, canvas.height / 3);

    // Right goal
    ctx.fillRect(canvas.width - 50, canvas.height / 3, 50, canvas.height / 3);
  }

  function checkGoals(giraffe) {
    // Check if a giraffe enters the left goal
    if (giraffe.x < 50 && giraffe.y > canvas.height / 3 && giraffe.y < (2 * canvas.height) / 3) {
      triggerConfetti();
      gameWon = true;
    }

    // Check if a giraffe enters the right goal
    if (giraffe.x + giraffe.width > canvas.width - 50 && giraffe.y > canvas.height / 3 && giraffe.y < (2 * canvas.height) / 3) {
      triggerConfetti();
      gameWon = true;
    }
  }

  function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 + 1,
      });
    }
  }

  function drawConfetti() {
    confetti.forEach((particle, index) => {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

      // Update confetti position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Remove confetti if it goes off-screen
      if (particle.y > canvas.height) {
        confetti.splice(index, 1);
      }
    });
  }

  function animate() {
    // Clear the canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw goals
    drawGoals();

    // Loop through each giraffe
    for (let giraffe of giraffes) {
      // Calculate distance between mouse and giraffe
      const dx = mouse.x - (giraffe.x + giraffe.width / 2);
      const dy = mouse.y - (giraffe.y + giraffe.width / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the mouse is close, move the giraffe away
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        giraffe.x -= Math.cos(angle) * 5; // Move away from the mouse
        giraffe.y -= Math.sin(angle) * 5;
      }

      // Update giraffe position and rotation
      giraffe.x += giraffe.speed;
      giraffe.angle += giraffe.rotationSpeed;

      // Reset giraffe position when it goes off-screen
      if (giraffe.x > canvas.width) {
        giraffe.x = -giraffe.width;
        giraffe.y = Math.random() * canvas.height;
      }

      // Check if giraffe enters a goal
      checkGoals(giraffe);

      drawGiraffe(giraffe);
    }

    // Draw confetti if triggered
    if (gameWon) {
      drawConfetti();
    }

    requestAnimationFrame(animate);
  }

  // Track mouse movement
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  giraffeImage.onload = () => {
    sunglassesImage.onload = () => {
      animate(); // Start animation only after both images are loaded
    };
  };
});