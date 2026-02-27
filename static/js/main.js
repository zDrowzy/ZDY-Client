// Canvas animation con Motion Blur
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const triangles = [];
const count = 50;

class Triangle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 20;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
        // Motion blur trail
        this.trail = [];
    }
    
    update() {
        // Guardar posición anterior para el trail
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 5) this.trail.shift();
        
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
    }
    
    draw() {
        // Dibujar trail (motion blur)
        this.trail.forEach((pos, index) => {
            const trailOpacity = (index / this.trail.length) * this.opacity * 0.5;
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = trailOpacity;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        });
        
        // Dibujar triángulo principal
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

for (let i = 0; i < count; i++) {
    triangles.push(new Triangle());
}

function animate() {
    // Clear con un poco de transparencia para efecto de arrastre global
    ctx.fillStyle = 'rgba(3, 3, 5, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    triangles.forEach(t => {
        t.update();
        t.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// Modal Functions
function openModal(type = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (type === 'signup') {
        switchToSignup();
    } else {
        switchToLogin();
    }
}

function closeModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

function switchToLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    const btn = e.target.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Welcome back, ${email}!\n\nLogin successful!`);
        closeModal();
        btn.textContent = originalText;
        btn.disabled = false;
        e.target.reset();
    }, 1500);
}

// Handle Sign Up
function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const btn = e.target.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Creating account...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Welcome to ZDY, ${username}!\n\nAccount created successfully!`);
        closeModal();
        btn.textContent = originalText;
        btn.disabled = false;
        e.target.reset();
    }, 1500);
}

// Smooth scroll
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Active nav link & Navbar Blur on scroll
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Navbar Motion Blur Effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link Logic
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
    
    updateSidebarDots();
});

// Sidebar dots
function updateSidebarDots() {
    const dots = document.querySelectorAll('.dot');
    const sectionIds = ['home', 'features', 'pricing'];
    
    let current = 0;
    sectionIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 300 && rect.bottom >= 300) {
                current = index;
            }
        }
    });
    
    dots.forEach((dot, index) => {
        if (index === current) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Scroll animations with blur
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.filter = 'blur(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .pricing-card, .video-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.filter = 'blur(10px)'; // Start blurred
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Video player
function playVideo(title) {
    alert(`🎬 Playing: ${title}\n\nVideo player would open here.`);
}

// Plan selection
function selectPlan(plan) {
    alert(`🎯 You selected: ${plan} Plan\n\nRedirecting to payment gateway...`);
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ZDY Client - Motion Blur Edition Loaded');
    updateSidebarDots();
});