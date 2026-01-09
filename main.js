console.log("✨ Abbi's creative portal is live.");

// ============================================
// SMOOTH CURSOR TRAIL - No dots, just smooth lines
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

// Smooth trail system
const trail = [];
const fadeTime = 1000; // 1 second fade

// Drawing settings for smooth lines
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Mouse tracking with interpolation
let lastX = null;
let lastY = null;

// Add point to trail with timestamp
function addPoint(x, y) {
    trail.push({
        x: x,
        y: y,
        timestamp: Date.now()
    });

    // Limit trail length for performance
    if (trail.length > 100) {
        trail.shift();
    }
}

// Mouse move handler with smooth interpolation
document.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Interpolate between last position and current for smoothness
    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add intermediate points if mouse moved far
        const steps = Math.max(1, Math.floor(distance / 5));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            addPoint(
                lastX + dx * t,
                lastY + dy * t
            );
        }
    } else {
        addPoint(currentX, currentY);
    }

    lastX = currentX;
    lastY = currentY;
});

// Reset when mouse leaves
document.addEventListener('mouseleave', () => {
    lastX = null;
    lastY = null;
});

// Touch support for mobile
let touchActive = false;

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.max(1, Math.floor(distance / 5));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            addPoint(
                lastX + dx * t,
                lastY + dy * t
            );
        }
    } else {
        addPoint(currentX, currentY);
    }

    lastX = currentX;
    lastY = currentY;
    touchActive = true;
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
    touchActive = true;
});

document.addEventListener('touchend', () => {
    lastX = null;
    lastY = null;
    touchActive = false;
});

// Animation loop - smooth rendering
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (trail.length > 0 && now - trail[0].timestamp > fadeTime) {
        trail.shift();
    }

    // Draw smooth continuous trail
    if (trail.length > 1) {
        // Start path
        ctx.beginPath();

        // Move to first point
        ctx.moveTo(trail[0].x, trail[0].y);

        // Draw smooth curve through all points using quadratic curves
        for (let i = 1; i < trail.length; i++) {
            const point = trail[i];
            const age = now - point.timestamp;

            // Calculate opacity based on age
            const opacity = (1 - age / fadeTime) * 0.5;

            // Use quadratic curve for smoothness
            if (i < trail.length - 1) {
                const nextPoint = trail[i + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;
                ctx.quadraticCurveTo(point.x, point.y, midX, midY);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        // Calculate average opacity from all points
        let avgOpacity = 0;
        for (let i = 0; i < trail.length; i++) {
            const age = now - trail[i].timestamp;
            avgOpacity += (1 - age / fadeTime);
        }
        avgOpacity = (avgOpacity / trail.length) * 0.5;

        // Apply stroke with smooth gradient effect
        ctx.strokeStyle = `rgba(255, 184, 77, ${Math.max(0, avgOpacity)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}

// Start animation loop
animate();

console.log('🎨 Move your cursor to see the smooth trail effect!');
