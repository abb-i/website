console.log("✨ Abbi's creative portal is live.");

// ============================================
// SIMPLE CURSOR TRAIL - Clean & Minimal
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

// Trail points
const points = [];
const maxAge = 1500; // 1.5 seconds

// Track mouse
let lastX = null;
let lastY = null;

// Mouse move
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    points.push({ x: e.clientX, y: e.clientY, time: now });

    // Smooth interpolation
    if (lastX !== null) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 2) {
            const steps = Math.floor(dist / 2);
            for (let i = 1; i < steps; i++) {
                const t = i / steps;
                points.push({
                    x: lastX + dx * t,
                    y: lastY + dy * t,
                    time: now
                });
            }
        }
    }

    lastX = e.clientX;
    lastY = e.clientY;

    // Limit points
    if (points.length > 100) {
        points.shift();
    }
});

// Touch support
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const now = Date.now();
    points.push({ x: touch.clientX, y: touch.clientY, time: now });

    if (lastX !== null) {
        const dx = touch.clientX - lastX;
        const dy = touch.clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 2) {
            const steps = Math.floor(dist / 2);
            for (let i = 1; i < steps; i++) {
                const t = i / steps;
                points.push({
                    x: lastX + dx * t,
                    y: lastY + dy * t,
                    time: now
                });
            }
        }
    }

    lastX = touch.clientX;
    lastY = touch.clientY;
}, { passive: false });

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (points.length && now - points[0].time > maxAge) {
        points.shift();
    }

    // Draw trail
    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        // Simple style
        ctx.strokeStyle = 'rgba(255, 184, 77, 0.6)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    requestAnimationFrame(render);
}

render();

console.log('🎨 Simple cursor trail active');
