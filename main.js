console.log("✨ Abbi's premium portal is live.");

// ============================================
// CURSOR TRAIL DRAWING - Auto-fading
// ============================================

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing settings
const trailColor = 'rgba(255, 215, 0, 0.6)'; // Gold with transparency
const trailWidth = 2;
const fadeSpeed = 0.02; // How fast the trail fades

// Set up canvas for drawing
ctx.strokeStyle = trailColor;
ctx.lineWidth = trailWidth;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Store mouse position
let mouseX = -100;
let mouseY = -100;
let lastX = -100;
let lastY = -100;
let isMoving = false;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Only draw if we have a previous position
    if (lastX !== -100 && lastY !== -100) {
        isMoving = true;
        drawLine(lastX, lastY, mouseX, mouseY);
    }

    lastX = mouseX;
    lastY = mouseY;
});

// Draw line function
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Auto-fade effect
function fadeCanvas() {
    // Create a semi-transparent rectangle over the entire canvas
    ctx.fillStyle = 'rgba(10, 14, 39, ' + fadeSpeed + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(fadeCanvas);
}

// Start the fade animation
fadeCanvas();

// Reset position when mouse leaves window
document.addEventListener('mouseleave', () => {
    lastX = -100;
    lastY = -100;
    isMoving = false;
});

// Touch support for mobile
let touchStarted = false;

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;

    if (touchStarted && lastX !== -100 && lastY !== -100) {
        drawLine(lastX, lastY, mouseX, mouseY);
    }

    lastX = mouseX;
    lastY = mouseY;
    touchStarted = true;
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
    touchStarted = true;
});

document.addEventListener('touchend', () => {
    lastX = -100;
    lastY = -100;
    touchStarted = false;
});

console.log('🎨 Move your cursor to draw a trail that fades away!');
