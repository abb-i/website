console.log("✨ Abbi's creative portal is live.");

// ============================================
// SMOOTH TAPERED CURSOR TRAIL
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
const fadeTime = 2500; // 2.5 seconds fade

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

    if (trail.length > 120) {
        trail.shift();
    }
}

// Mouse move handler with extra smoothness
document.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Ultra smooth interpolation
    if (lastX !== null && lastY !== null) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.max(1, Math.ceil(distance / 1.5));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Smooth easing for extra smoothness
            const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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

        const steps = Math.max(1, Math.ceil(distance / 1.5));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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

// Animation loop with tapered effect
function animate() {
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (trail.length > 0 && now - trail[0].timestamp > fadeTime) {
        trail.shift();
    }

    // Draw smooth tapered trail
    if (trail.length > 1) {
        // Draw trail in segments with varying thickness
        for (let i = 0; i < trail.length - 1; i++) {
            const point = trail[i];
            const nextPoint = trail[i + 1];
            const age = now - point.timestamp;

            // Calculate fade factor (0 to 1, where 1 is newest)
            const fadeFactor = 1 - (age / fadeTime);

            // Opacity fades out
            const opacity = fadeFactor * 0.8;

            // Line width tapers from 5px to 0.5px
            const lineWidth = 0.5 + (fadeFactor * 4.5);

            if (opacity > 0.05) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);

                // Use quadratic curve for smoothness
                if (i < trail.length - 2) {
                    const nextNextPoint = trail[i + 2];
                    const cpX = nextPoint.x;
                    const cpY = nextPoint.y;
                    const endX = (nextPoint.x + nextNextPoint.x) / 2;
                    const endY = (nextPoint.y + nextNextPoint.y) / 2;
                    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                } else {
                    ctx.lineTo(nextPoint.x, nextPoint.y);
                }

                ctx.strokeStyle = `rgba(255, 184, 77, ${opacity})`;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();

console.log('🎨 Move your cursor to see the smooth tapered trail!');
