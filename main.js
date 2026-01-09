console.log("✨ Abbi's creative portal is live.");

// ============================================
// SIMPLE SMOOTH CURSOR TRAIL
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

// Trail system
const trail = [];
const fadeTime = 1700; // 1.7 seconds fade

// Mouse tracking
let lastX = null;
let lastY = null;

// Add point to trail
function addPoint(x, y) {
    trail.push({
        x: x,
        y: y,
        timestamp: Date.now()
    });

    if (trail.length > 100) {
        trail.shift();
    }
}

// Mouse move handler
document.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Smooth interpolation
    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.max(1, Math.ceil(distance / 2));
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

// Touch support
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.max(1, Math.ceil(distance / 2));
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

// Animation loop
function animate() {
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (trail.length > 0 && now - trail[0].timestamp > fadeTime) {
        trail.shift();
    }

    // Draw smooth trail
    if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        // Draw smooth curve through points
        for (let i = 1; i < trail.length - 1; i++) {
            const point = trail[i];
            const nextPoint = trail[i + 1];
            const midX = (point.x + nextPoint.x) / 2;
            const midY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, midX, midY);
        }

        // Draw to last point
        if (trail.length > 1) {
            const lastPoint = trail[trail.length - 1];
            ctx.lineTo(lastPoint.x, lastPoint.y);
        }

        // Calculate average opacity
        let totalOpacity = 0;
        for (let i = 0; i < trail.length; i++) {
            const age = now - trail[i].timestamp;
            totalOpacity += (1 - age / fadeTime);
        }
        const avgOpacity = (totalOpacity / trail.length) * 0.8;

        // Draw the line - 10px thick, no glow
        ctx.strokeStyle = `rgba(255, 184, 77, ${Math.max(0, avgOpacity)})`;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();

console.log('🎨 Move your cursor to see the smooth trail!');
