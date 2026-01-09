console.log("Abbi's creative portal is live.");

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const config = {
    color: { r: 255, g: 184, b: 77 },
    maxAge: 800,
    minWidth: 1.5,
    maxWidth: 3.5,
    smoothingFactor: 0.15,
    maxPoints: 80
};

const trail = [];
let lastVelocity = 0;

function addPoint(x, y) {
    const now = Date.now();

    let velocity = 0;
    let width = (config.minWidth + config.maxWidth) / 2;

    if (trail.length > 0) {
        const lastPoint = trail[trail.length - 1];
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        velocity = Math.min(distance, 15);
        const normalizedVelocity = velocity / 15;
        width = config.maxWidth - (normalizedVelocity * (config.maxWidth - config.minWidth));

        width = lastVelocity + (width - lastVelocity) * config.smoothingFactor;
        lastVelocity = width;

        if (distance > 5) {
            const steps = Math.ceil(distance / 3);
            for (let i = 1; i < steps; i++) {
                const t = i / steps;
                trail.push({
                    x: lastPoint.x + dx * t,
                    y: lastPoint.y + dy * t,
                    time: now,
                    width: width
                });
            }
        }
    }

    trail.push({ x, y, time: now, width });

    if (trail.length > config.maxPoints) {
        trail.shift();
    }
}

function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    while (trail.length && now - trail[0].time > config.maxAge) {
        trail.shift();
    }

    if (trail.length < 2) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < trail.length - 1; i++) {
        const point = trail[i];
        const nextPoint = trail[i + 1];

        const age = now - point.time;
        const lifeRatio = 1 - (age / config.maxAge);
        const opacity = Math.pow(lifeRatio, 1.5);

        const positionFade = i / trail.length;
        const combinedOpacity = opacity * Math.pow(positionFade, 0.5);

        if (combinedOpacity <= 0.01) continue;

        ctx.beginPath();

        const p0 = i > 0 ? trail[i - 1] : point;
        const p1 = point;
        const p2 = nextPoint;
        const p3 = i < trail.length - 2 ? trail[i + 2] : nextPoint;

        ctx.moveTo(p1.x, p1.y);

        const tension = 0.5;
        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);

        const avgWidth = (p1.width + p2.width) / 2;
        ctx.lineWidth = avgWidth;
        ctx.strokeStyle = `rgba(${config.color.r}, ${config.color.g}, ${config.color.b}, ${combinedOpacity * 0.7})`;
        ctx.stroke();
    }
}

document.addEventListener('pointermove', (e) => {
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

    events.forEach(event => {
        addPoint(event.clientX, event.clientY);
    });
});

document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    addPoint(touch.clientX, touch.clientY);
}, { passive: true });

function animate() {
    drawTrail();
    requestAnimationFrame(animate);
}

animate();

console.log('Flowing cursor trail active');
