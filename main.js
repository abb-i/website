console.log("✨ Abbi's premium portal is live.");

// ============================================
// CURSOR TRAIL - Follows mouse movement, fades after 1 second
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

// Trail points - each point stored with timestamp
const trailPoints = [];
const maxTrailLength = 50; // Maximum points in trail

// Drawing settings
const trailColor = 'rgba(255, 215, 0, 0.6)'; // Gold with transparency
const trailWidth = 2;
const fadeTime = 1000; // 1 second in milliseconds

// Track mouse position
let lastX = -100;
let lastY = -100;
let lastTime = Date.now();

// Mouse move - add trail points
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Only add point if mouse actually moved
    if (lastX !== currentX || lastY !== currentY) {
        // Add new point
        trailPoints.push({
            x: currentX,
            y: currentY,
            timestamp: currentTime
        });

        // Limit trail length
        if (trailPoints.length > maxTrailLength) {
            trailPoints.shift();
        }
    }

    lastX = currentX;
    lastY = currentY;
    lastTime = currentTime;
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentTime = Date.now();

    trailPoints.push({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: currentTime
    });

    if (trailPoints.length > maxTrailLength) {
        trailPoints.shift();
    }
}, { passive: false });

// Animation loop - render trail with fade effect
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points (older than fadeTime)
    while (trailPoints.length > 0 && now - trailPoints[0].timestamp > fadeTime) {
        trailPoints.shift();
    }

    // Draw trail
    if (trailPoints.length > 1) {
        for (let i = 0; i < trailPoints.length - 1; i++) {
            const point = trailPoints[i];
            const nextPoint = trailPoints[i + 1];
            const age = now - point.timestamp;

            // Skip if too old
            if (age > fadeTime) continue;

            // Calculate opacity based on age
            const opacity = (1 - age / fadeTime) * 0.6;

            // Draw line segment
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
            ctx.lineWidth = trailWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
    }

    requestAnimationFrame(animate);
}

// Start animation loop
animate();

console.log('🎨 Move your cursor to see the magical trail!');
