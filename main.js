console.log("Abbi's holographic portal is live.");

// Particle canvas effect
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 25; // Reduced from many stars to just a few subtle dots

// Color palette from the website design
const colors = [
    'rgba(107, 68, 35, 0.3)',   // Brown
    'rgba(139, 111, 71, 0.3)',  // Medium brown
    'rgba(168, 145, 120, 0.3)', // Tan
    'rgba(201, 185, 155, 0.3)'  // Light tan
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
        // Start at random positions instead of all from bottom
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 2.5 + 1.5; // Small dots
        this.speedY = Math.random() * 0.3 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Gentle floating motion
        this.x += Math.sin(this.y * 0.01) * 0.2;

        // Reset when particle goes off screen
        if (this.y < -10) {
            this.reset();
        }

        if (this.x < -10 || this.x > canvas.width + 10) {
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Initialize and start animation
init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
});
