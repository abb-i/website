console.log("✨ Abbi's creative portal is live.");

// ============================================
// FLOWING CURSOR TRAIL - Gentle & Aesthetic
// Pen-like effect with smooth fade
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

// Trail configuration
const config = {
    color: { r: 255, g: 184, b: 77 }, // #FFB84D
    maxAge: 800, // milliseconds
    minWidth: 1.5,
    maxWidth: 3.5,
    smoothingFactor: 0.15,
    maxPoints: 80
};

// Trail state
const trail = [];
let lastVelocity = 0;

// Add point with velocity-based width
function addPoint(x, y) {
    const now = Date.now();

    let velocity = 0;
    let width = (config.minWidth + config.maxWidth) / 2;

    if (trail.length > 0) {
        const lastPoint = trail[trail.length - 1];
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate velocity (inverse for width - slow = thick, fast = thin)
        velocity = Math.min(distance, 15);
        const normalizedVelocity = velocity / 15;
        width = config.maxWidth - (normalizedVelocity * (config.maxWidth - config.minWidth));

        // Smooth width transitions
        width = lastVelocity + (width - lastVelocity) * config.smoothingFactor;
        lastVelocity = width;
    }

    trail.push({ x, y, time: now, width });

    // Limit trail length
    if (trail.length > config.maxPoints) {
        trail.shift();
    }
}

// Draw flowing trail with smooth curves
function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Remove old points
    while (trail.length && now - trail[0].time > config.maxAge) {
        trail.shift();
    }

    if (trail.length < 2) return;

    // Draw segments with fading opacity
    for (let i = 1; i < trail.length; i++) {
        const point = trail[i];
        const prevPoint = trail[i - 1];

        // Calculate age-based opacity
        const age = now - point.time;
        const lifeRatio = 1 - (age / config.maxAge);
        const opacity = Math.pow(lifeRatio, 1.5); // Gentle fade curve

        // Calculate position-based fade (older points = more transparent)
        const positionFade = i / trail.length;
        const combinedOpacity = opacity * Math.pow(positionFade, 0.5);

        if (combinedOpacity <= 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);

        // Smooth curve to next point
        if (i < trail.length - 1) {
            const nextPoint = trail[i + 1];
            const midX = (point.x + nextPoint.x) / 2;
            const midY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, midX, midY);
        } else {
            ctx.lineTo(point.x, point.y);
        }

        // Style with gradient opacity
        const avgWidth = (prevPoint.width + point.width) / 2;
        ctx.lineWidth = avgWidth;
        ctx.strokeStyle = `rgba(${config.color.r}, ${config.color.g}, ${config.color.b}, ${combinedOpacity * 0.7})`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
}

// Mouse/pointer movement
document.addEventListener('pointermove', (e) => {
    // Get coalesced events for smoother trail
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

    events.forEach(event => {
        addPoint(event.clientX, event.clientY);
    });
});

// Touch support
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    addPoint(touch.clientX, touch.clientY);
}, { passive: true });

// Animation loop
function animate() {
    drawTrail();
    requestAnimationFrame(animate);
}

animate();

console.log('✨ Flowing cursor trail active');
