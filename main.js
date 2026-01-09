console.log("Abbi's premium portal with magical drawing is live.");

// Drawing Canvas Setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing settings
ctx.strokeStyle = '#f4d03f';
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.globalAlpha = 0.7;

// Check if click is on empty space (background)
function isClickOnBackground(e) {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    // If only canvas and body are under the cursor, it's background
    return elements.length <= 2 && (elements[0] === canvas || elements[0] === document.body);
}

// Start drawing
function startDrawing(e) {
    if (!isClickOnBackground(e)) return;

    isDrawing = true;
    canvas.classList.add('drawing-active');

    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    // Begin path
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

// Draw
function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Create gradient for more premium look
    const gradient = ctx.createLinearGradient(lastX, lastY, currentX, currentY);
    gradient.addColorStop(0, '#f4d03f');
    gradient.addColorStop(0.5, '#FFB84D');
    gradient.addColorStop(1, '#d4af6a');

    ctx.strokeStyle = gradient;
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

// Stop drawing
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        canvas.classList.remove('drawing-active');
        ctx.beginPath(); // Reset path
    }
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Optional: Clear canvas with double-click on background
canvas.addEventListener('dblclick', (e) => {
    if (isClickOnBackground(e)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('Canvas cleared!');
    }
});

// Keyboard shortcut: Press 'c' to clear canvas
document.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('Canvas cleared with keyboard shortcut!');
    }
});
