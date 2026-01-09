console.log("✨ Abbi's premium experience with magical drawing is live.");

// ============================================
// DRAWING CANVAS SETUP
// ============================================

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Canvas state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing settings
let currentColor = '#FFD700';
let brushSize = 3;
let currentTool = 'draw';

// Set canvas size
function resizeCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Save current drawing
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Restore drawing
    ctx.drawImage(tempCanvas, 0, 0);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Update brush properties
function updateBrushStyle() {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = currentTool === 'erase' ? 'destination-out' : 'source-over';
    ctx.globalAlpha = currentTool === 'erase' ? 1 : 0.85;
}

updateBrushStyle();

// ============================================
// TOOLBAR CONTROLS
// ============================================

// Tool buttons (draw/erase)
const toolButtons = document.querySelectorAll('[data-tool]');
toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        updateBrushStyle();
        updateBrushPreview();
    });
});

// Brush size control
const brushSlider = document.getElementById('brushSize');
const brushPreview = document.querySelector('.brush-preview');

brushSlider.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    updateBrushStyle();
    updateBrushPreview();
});

function updateBrushPreview() {
    const previewDot = brushPreview.querySelector('::after');
    const size = Math.max(4, Math.min(brushSize * 2, 20));
    brushPreview.style.background = currentTool === 'erase' ? '#f38181' : currentColor;

    // Update CSS variable for pseudo-element
    document.documentElement.style.setProperty('--brush-preview-size', `${size}px`);
}

// Add CSS variable support for brush preview
const style = document.createElement('style');
style.textContent = `
    .brush-preview::after {
        width: var(--brush-preview-size, 6px) !important;
        height: var(--brush-preview-size, 6px) !important;
    }
`;
document.head.appendChild(style);

// Color picker
const colorButtons = document.querySelectorAll('[data-color]');
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.dataset.color;
        if (currentTool === 'draw') {
            updateBrushStyle();
            updateBrushPreview();
        }
    });
});

// Clear canvas button
const clearButton = document.getElementById('clearCanvas');
clearButton.addEventListener('click', () => {
    if (confirm('Clear all drawings?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('🎨 Canvas cleared!');
    }
});

// ============================================
// DRAWING FUNCTIONALITY
// ============================================

// Check if click is on background (not on content)
function isClickOnBackground(e) {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Check if we're clicking on canvas or body (background)
    if (elements[0] === canvas || elements[0] === document.body) {
        return true;
    }

    // Check if we're clicking on container but not on interactive elements
    const clickedElement = elements[0];
    const isInteractive = clickedElement.closest('a, button, input') !== null;
    const isContent = clickedElement.closest('.hero-section, .social-card, .content-card, .footer') !== null;

    return !isInteractive && !isContent;
}

// Start drawing
function startDrawing(e) {
    // Only draw on background areas
    if (!isClickOnBackground(e)) {
        return;
    }

    e.preventDefault();
    isDrawing = true;
    canvas.classList.add('drawing-active');

    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

// Draw
function draw(e) {
    if (!isDrawing) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Smooth drawing
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);

    lastX = currentX;
    lastY = currentY;
}

// Stop drawing
function stopDrawing(e) {
    if (isDrawing) {
        isDrawing = false;
        canvas.classList.remove('drawing-active');
        ctx.beginPath();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}, { passive: false });

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // 'D' for draw
    if (e.key === 'd' || e.key === 'D') {
        document.querySelector('[data-tool="draw"]').click();
    }
    // 'E' for erase
    if (e.key === 'e' || e.key === 'E') {
        document.querySelector('[data-tool="erase"]').click();
    }
    // 'C' to clear (with confirmation)
    if (e.key === 'c' || e.key === 'C') {
        if (!e.repeat) {
            clearButton.click();
        }
    }
    // Number keys 1-6 for colors
    if (e.key >= '1' && e.key <= '6') {
        const index = parseInt(e.key) - 1;
        const colorBtn = colorButtons[index];
        if (colorBtn) {
            colorBtn.click();
        }
    }
    // '[' and ']' for brush size
    if (e.key === '[') {
        brushSize = Math.max(1, brushSize - 1);
        brushSlider.value = brushSize;
        updateBrushStyle();
        updateBrushPreview();
    }
    if (e.key === ']') {
        brushSize = Math.min(20, brushSize + 1);
        brushSlider.value = brushSize;
        updateBrushStyle();
        updateBrushPreview();
    }
});

// ============================================
// INTERACTIVE ANIMATIONS
// ============================================

// Add subtle parallax effect to cards on mouse move
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.content-card, .social-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
        const speed = (index + 1) * 2;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        // Only apply if not currently interacting with the card
        if (!card.matches(':hover')) {
            card.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});

// Reset transform on hover
document.querySelectorAll('.content-card, .social-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = '';
    });
});

// ============================================
// VISUAL FEEDBACK
// ============================================

// Add drawing indicator when drawing mode is active
function createDrawingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'drawing-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: rgba(20, 24, 41, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 30px;
        color: #FFD700;
        font-size: 13px;
        font-weight: 600;
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    indicator.textContent = '🎨 Draw on the background';
    document.body.appendChild(indicator);

    // Show on first load
    setTimeout(() => {
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 3000);
    }, 1000);
}

createDrawingIndicator();

// Show helpful tips
console.log(`
🎨 Drawing Controls:
   - Draw/Erase on empty background areas
   - Toolbar at bottom for controls

⌨️  Keyboard Shortcuts:
   D - Draw tool
   E - Erase tool
   C - Clear canvas
   1-6 - Select colors
   [ ] - Adjust brush size

💡 Tip: Click and drag on the background to create your art!
`);

// Initialize brush preview
updateBrushPreview();
