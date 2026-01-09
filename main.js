console.log("✨ Abbi's creative portal is live.");

// ============================================
// PEN-LIKE DRAWING FEATURE
// Natural, smooth strokes with pressure simulation
// ============================================

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
function resizeCanvas() {
    const oldCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.putImageData(oldCanvas, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isDrawing = false;
let currentStroke = [];
const strokes = [];

// Drawing configuration
const config = {
    color: '#FFB84D',
    minWidth: 1,
    maxWidth: 4,
    smoothing: 0.5,
    velocityFilterWeight: 0.7
};

// Velocity tracking for pressure simulation
let lastPoint = null;
let lastVelocity = 0;

// Calculate line width based on velocity (inverse relationship)
function getLineWidth(velocity) {
    const normalizedVelocity = Math.min(velocity, 10) / 10;
    const width = config.maxWidth - (normalizedVelocity * (config.maxWidth - config.minWidth));

    // Smooth the width changes
    const smoothedWidth = lastVelocity * config.velocityFilterWeight + width * (1 - config.velocityFilterWeight);
    lastVelocity = smoothedWidth;

    return smoothedWidth;
}

// Add point to current stroke
function addPoint(x, y, pressure = 0.5) {
    const point = { x, y, pressure };

    if (lastPoint) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = distance;

        point.width = getLineWidth(velocity);

        // Add pressure from stylus if available, otherwise use velocity-based
        if (pressure === 0.5) {
            // Simulate pressure based on velocity
            point.width = getLineWidth(velocity);
        } else {
            // Use actual stylus pressure
            point.width = config.minWidth + (pressure * (config.maxWidth - config.minWidth));
        }
    } else {
        point.width = (config.minWidth + config.maxWidth) / 2;
    }

    currentStroke.push(point);
    lastPoint = point;
}

// Draw stroke using quadratic Bezier curves
function drawStroke(stroke) {
    if (stroke.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);

    // Draw smooth curves through all points
    for (let i = 1; i < stroke.length - 1; i++) {
        const point = stroke[i];
        const nextPoint = stroke[i + 1];

        // Use midpoint for smooth quadratic curve
        const midX = (point.x + nextPoint.x) / 2;
        const midY = (point.y + nextPoint.y) / 2;

        ctx.lineWidth = point.width;
        ctx.strokeStyle = config.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.quadraticCurveTo(point.x, point.y, midX, midY);
        ctx.stroke();
    }

    // Draw the last point
    const lastIdx = stroke.length - 1;
    if (lastIdx > 0) {
        ctx.lineWidth = stroke[lastIdx].width;
        ctx.lineTo(stroke[lastIdx].x, stroke[lastIdx].y);
        ctx.stroke();
    }
}

// Redraw all strokes
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(stroke => drawStroke(stroke));

    if (isDrawing && currentStroke.length > 0) {
        drawStroke(currentStroke);
    }
}

// Pointer event handlers
canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    currentStroke = [];
    lastPoint = null;
    lastVelocity = 0;

    addPoint(e.clientX, e.clientY, e.pressure);
    redrawCanvas();
});

canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;

    // Get coalesced events for higher fidelity
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

    events.forEach(event => {
        addPoint(event.clientX, event.clientY, event.pressure);
    });

    redrawCanvas();
});

canvas.addEventListener('pointerup', (e) => {
    if (!isDrawing) return;

    isDrawing = false;

    if (currentStroke.length > 0) {
        strokes.push([...currentStroke]);
        currentStroke = [];
    }

    lastPoint = null;
    redrawCanvas();
});

canvas.addEventListener('pointercancel', (e) => {
    isDrawing = false;
    currentStroke = [];
    lastPoint = null;
    redrawCanvas();
});

// Add clear functionality (double-click to clear)
canvas.addEventListener('dblclick', () => {
    strokes.length = 0;
    currentStroke = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

console.log('✏️ Pen-like drawing active (double-click to clear)');
