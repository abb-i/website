console.log("Abbi's retro portal is live.");

// Magical Cursor Trail Animation
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Retro color palette
const colors = ['#68C7C1', '#FACA78', '#F57F5B', '#DD5341', '#79443A'];

// Trail particles
const particles = [];
const maxParticles = 100;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 8;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.2 - 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.97;
        this.angle += this.spin;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw sparkle shape
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color + 'CC');
        gradient.addColorStop(1, this.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();

        // Star shape
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * (this.size * 0.4);
            const innerY = Math.sin(innerAngle) * (this.size * 0.4);
            ctx.lineTo(innerX, innerY);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0 || this.size < 0.5;
    }
}

// Mouse position
let mouseX = 0;
let mouseY = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Track mouse movement
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Calculate distance moved
    const distance = Math.sqrt(
        Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2)
    );

    // Only create particles if mouse moved significantly
    if (distance > 5) {
        isDrawing = true;

        // Create particles along the path
        const steps = Math.ceil(distance / 10);
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = lastX + (mouseX - lastX) * t;
            const y = lastY + (mouseY - lastY) * t;

            if (particles.length < maxParticles) {
                particles.push(new Particle(x, y));
            }
        }

        lastX = mouseX;
        lastY = mouseY;
    }
});

// Track when mouse enters/leaves
window.addEventListener('mouseenter', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
});

// Smooth line trail
let trail = [];
const trailLength = 20;

function drawTrail() {
    if (trail.length < 2) return;

    ctx.globalCompositeOperation = 'source-over';

    for (let i = 1; i < trail.length; i++) {
        const point = trail[i];
        const prevPoint = trail[i - 1];
        const alpha = (i / trail.length) * 0.3;
        const width = (i / trail.length) * 3;

        ctx.strokeStyle = `rgba(250, 202, 120, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }
}

// Animation loop
function animate() {
    // Clear canvas with slight fade for trail effect
    ctx.fillStyle = 'rgba(245, 230, 211, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update trail
    trail.push({ x: mouseX, y: mouseY });
    if (trail.length > trailLength) {
        trail.shift();
    }

    // Draw smooth trail
    drawTrail();

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Optional: Add touch support for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;

    const distance = Math.sqrt(
        Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2)
    );

    if (distance > 5) {
        if (particles.length < maxParticles) {
            particles.push(new Particle(mouseX, mouseY));
        }
        lastX = mouseX;
        lastY = mouseY;
    }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
});

// Add hint text that fades away
setTimeout(() => {
    const hint = document.createElement('div');
    hint.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: #79443A;
        font-family: 'Kalam', cursive;
        font-size: 18px;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        animation: hintFade 4s ease-in-out forwards;
    `;
    hint.textContent = 'move your cursor to draw ✨';
    document.body.appendChild(hint);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes hintFade {
            0%, 10% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            20%, 70% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        hint.remove();
        style.remove();
    }, 4000);
}, 2500);
