console.log("✨ Abbi's premium portal is live.");

// ============================================
// DRAWING GIMMICK - Disappears after 1 second
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

// Drawing particles - each stroke is stored with timestamp
const strokes = [];

// Drawing settings
const strokeColor = 'rgba(255, 215, 0, 0.8)'; // Gold
const strokeWidth = 3;
const fadeTime = 1000; // 1 second in milliseconds

// Mouse tracking
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Mouse down - start drawing
document.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

// Mouse move - draw line
document.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    // Store this stroke with timestamp
    strokes.push({
        x1: lastX,
        y1: lastY,
        x2: currentX,
        y2: currentY,
        timestamp: Date.now()
    });

    lastX = currentX;
    lastY = currentY;
});

// Mouse up - stop drawing
document.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Mouse leave - stop drawing
document.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Touch support
let touchActive = false;

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchActive = true;
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!touchActive) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    // Store this stroke with timestamp
    strokes.push({
        x1: lastX,
        y1: lastY,
        x2: currentX,
        y2: currentY,
        timestamp: Date.now()
    });

    lastX = currentX;
    lastY = currentY;
}, { passive: false });

document.addEventListener('touchend', () => {
    touchActive = false;
});

// Animation loop - render and fade strokes
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Draw all strokes with opacity based on age
    for (let i = strokes.length - 1; i >= 0; i--) {
        const stroke = strokes[i];
        const age = now - stroke.timestamp;

        // Remove strokes older than fadeTime
        if (age > fadeTime) {
            strokes.splice(i, 1);
            continue;
        }

        // Calculate opacity (1 to 0 over fadeTime)
        const opacity = 1 - (age / fadeTime);

        // Draw stroke
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.8})`;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}

// Start animation loop
animate();

console.log('🎨 Click and drag to draw - your marks fade after 1 second!');
