console.log("✨ Abbi's creative portal is live.");

// ============================================
// SMOOTH FLOWING CURSOR TRAIL
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
const fadeTime = 2500; // 2.5 seconds fade (slower)

// Mouse tracking
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
    if (trail.length > 150) {
        trail.shift();
    }
}

// Mouse move handler with smooth interpolation
document.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Smooth interpolation between points
    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add more intermediate points for ultra-smooth lines
        const steps = Math.max(1, Math.ceil(distance / 3));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Smooth easing
            const smoothT = t * t * (3 - 2 * t);
            addPoint(
                lastX + dx * smoothT,
                lastY + dy * smoothT
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
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.max(1, Math.ceil(distance / 3));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const smoothT = t * t * (3 - 2 * t);
            addPoint(
                lastX + dx * smoothT,
                lastY + dy * smoothT
            );
        }
    } else {
        addPoint(currentX, currentY);
    }

    lastX = currentX;
    lastY = currentY;
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
});

document.addEventListener('touchend', () => {
    lastX = null;
    lastY = null;
});

// Catmull-Rom spline for ultra-smooth curves
function drawSmoothCurve(points, opacity) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Use Catmull-Rom spline for flowing curves
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        // Calculate control points for smooth Bezier curve
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    // Stroke with glow effect
    ctx.strokeStyle = `rgba(255, 184, 77, ${opacity})`;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 12;
    ctx.shadowColor = `rgba(255, 184, 77, ${opacity * 0.6})`;
    ctx.stroke();
}

// Animation loop - smooth rendering
function animate() {
    // Clear canvas with slight fade for smoother transitions
    ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (trail.length > 0 && now - trail[0].timestamp > fadeTime) {
        trail.shift();
    }

    // Draw trail in segments with varying opacity
    if (trail.length > 1) {
        const segmentSize = 8;
        for (let start = 0; start < trail.length; start += segmentSize) {
            const end = Math.min(start + segmentSize + 3, trail.length);
            const segment = trail.slice(start, end);

            // Calculate opacity based on average age of segment
            let totalAge = 0;
            for (let i = 0; i < segment.length; i++) {
                totalAge += now - segment[i].timestamp;
            }
            const avgAge = totalAge / segment.length;
            const opacity = Math.max(0, (1 - avgAge / fadeTime) * 0.85);

            if (opacity > 0.05) {
                drawSmoothCurve(segment, opacity);
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start animation loop
animate();

console.log('🎨 Move your cursor to see the smooth flowing trail!');
