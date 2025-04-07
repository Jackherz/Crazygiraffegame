window.addEventListener('load', () => {
  const canvas = document.getElementById('cloudCanvas');
  const ctx = canvas.getContext('2d');
  const drawButton = document.getElementById('drawButton');
  const eraseButton = document.getElementById('eraseButton');
  const colorPicker = document.getElementById('colorPicker');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isDrawing = false;
  let isErasing = false;
  let currentColor = '#000000';
  let giraffes = [];
  const giraffeImage = new Image();
  giraffeImage.src = 'giraffe.png'; // Ensure this file exists in your project directory
  const sunglassesImage = new Image();
  sunglassesImage.src = 'sunglasses.png'; // Ensure this file exists in your project directory
  const mouse = { x: 0, y: 0 };
  let confetti = [];
  let gameWon = false;
  let canvasRotation = 0; // Track canvas rotation

  // Create a separate canvas for drawing
  const drawingCanvas = document.createElement('canvas');
  const drawingCtx = drawingCanvas.getContext('2d');
  drawingCanvas.width = canvas.width;
  drawingCanvas.height = canvas.height;
  drawingCanvas.style.position = 'absolute';
  drawingCanvas.style.top = '0';
  drawingCanvas.style.left = '0';
  drawingCanvas.style.zIndex = '1'; // Layer it above the main canvas
  document.body.appendChild(drawingCanvas); // Add it to the DOM

  // Create giraffe objects
  for (let i = 0; i < 10; i++) {
    giraffes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 50 + Math.random() * 30,
      speed: 0.5 + Math.random() * 0.8,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: 0.01 + Math.random() * 0.05,
    });
  }

  // Drawing tools setup
  drawButton.addEventListener('click', () => {
    isDrawing = true;
    isErasing = false;
  });

  eraseButton.addEventListener('click', () => {
    isDrawing = false;
    isErasing = true;
  });

  colorPicker.addEventListener('input', (event) => {
    currentColor = event.target.value;
  });

  // Mouse events for drawing/erasing
  drawingCanvas.addEventListener('mousedown', () => {
    isDrawing = true;
  });

  drawingCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
    drawingCtx.beginPath(); // Reset the path
  });

  drawingCanvas.addEventListener('mousemove', (event) => {
    if (!isDrawing) return;

    const rect = drawingCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isErasing) {
      drawingCtx.clearRect(x - 5, y - 5, 10, 10); // Erase a small square
    } else {
      drawingCtx.strokeStyle = currentColor;
      drawingCtx.lineWidth = 5;
      drawingCtx.lineCap = 'round';
      drawingCtx.lineTo(x, y);
      drawingCtx.stroke();
      drawingCtx.beginPath();
      drawingCtx.moveTo(x, y);
    }
  });

  // Draw giraffes
  function drawGiraffe(giraffe) {
    const aspectRatio = giraffeImage.width / giraffeImage.height;
    const height = giraffe.width / aspectRatio;

    ctx.save();
    ctx.translate(giraffe.x + giraffe.width / 2, giraffe.y + height / 2);
    ctx.rotate(giraffe.angle);
    ctx.drawImage(giraffeImage, -giraffe.width / 2, -height / 2, giraffe.width, height);

    const sunglassesWidth = giraffe.width * 0.6;
    const sunglassesHeight = sunglassesWidth / 2;
    ctx.drawImage(sunglassesImage, -sunglassesWidth / 2, -height / 3, sunglassesWidth, sunglassesHeight);
    ctx.restore();
  }

  // Draw goals
  function drawGoals() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, canvas.height / 3, 50, canvas.height / 3);
    ctx.fillRect(canvas.width - 50, canvas.height / 3, 50, canvas.height / 3);
  }

  // Check if giraffe enters a goal
  function checkGoals(giraffe) {
    if (giraffe.x < 50 && giraffe.y > canvas.height / 3 && giraffe.y < (2 * canvas.height) / 3) {
      triggerConfetti();
      gameWon = true;
    }
    if (giraffe.x + giraffe.width > canvas.width - 50 && giraffe.y > canvas.height / 3 && giraffe.y < (2 * canvas.height) / 3) {
      triggerConfetti();
      gameWon = true;
    }
  }

  // Trigger confetti
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

  // Draw confetti
  function drawConfetti() {
    confetti.forEach((particle, index) => {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.y > canvas.height) {
        confetti.splice(index, 1);
      }
    });
  }

  // Animate everything
  function animate() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(canvasRotation);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the drawing layer
    ctx.drawImage(drawingCanvas, 0, 0);

    drawGoals();

    giraffes.forEach((giraffe) => {
      giraffe.x += giraffe.speed;
      giraffe.angle += giraffe.rotationSpeed;

      if (giraffe.x > canvas.width) {
        giraffe.x = -giraffe.width;
        giraffe.y = Math.random() * canvas.height;
      }

      checkGoals(giraffe);
      drawGiraffe(giraffe);
    });

    if (gameWon) {
      drawConfetti();
    }

    ctx.restore();
    requestAnimationFrame(animate);
  }

  // Rotate canvas on scroll
  window.addEventListener('wheel', (event) => {
    canvasRotation += event.deltaY * 0.001; // Adjust rotation speed
  });

  giraffeImage.onload = () => {
    sunglassesImage.onload = () => {
      animate();
    };
  };

  document.querySelector('h1').textContent = "I love you Lia Karabatsos";
});