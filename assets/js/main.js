/**
 * PROXY GROUP Landing Page - Main JavaScript
 * Handles animations, navigation, carousels, and form interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initCarousels();
    initContactForm();
});

/**
 * Initialize interactive particles/network canvas background
 * Creates a geometric constellation effect with mouse interaction
 */
function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Configuration
    const config = {
        particleCount: 80,
        particleMinSize: 1,
        particleMaxSize: 2.5,
        lineDistance: 150,
        particleSpeed: 0.3,
        lineColor: 'rgba(167, 139, 250, 0.15)',
        particleColor: 'rgba(167, 139, 250, 0.6)',
        mouseLineColor: 'rgba(124, 58, 237, 0.3)',
        mouseParticleColor: 'rgba(167, 139, 250, 0.9)'
    };

    // Resize canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (config.particleMaxSize - config.particleMinSize) + config.particleMinSize;
            this.baseSize = this.size;
            this.speedX = (Math.random() - 0.5) * config.particleSpeed;
            this.speedY = (Math.random() - 0.5) * config.particleSpeed;
            this.density = (Math.random() * 30) + 1;
        }

        update() {
            // Mouse interaction - particles move away from cursor
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * this.density * 0.02;
                    const forceY = (dy / distance) * force * this.density * 0.02;
                    
                    this.x -= forceX;
                    this.y -= forceY;
                    
                    // Increase size near mouse
                    this.size = this.baseSize + (force * 2);
                } else {
                    this.size = this.baseSize;
                }
            }

            // Regular movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }

    // Initialize particles array
    function initParticles() {
        particles = [];
        const particleCount = Math.min(config.particleCount, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw lines between nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.lineDistance) {
                    const opacity = 1 - (distance / config.lineDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const opacity = 1 - (distance / mouse.radius);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize and start
    resizeCanvas();
    animate();
}

/**
 * Initialize scroll-triggered animations using IntersectionObserver
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .stagger-children').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize sticky header behavior
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        body.style.overflow = 'hidden';
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        body.style.overflow = '';
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        `;
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize horizontal carousels (scroll-snap based)
 */
function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    if (!carousels.length) return;

    carousels.forEach((carousel) => {
        const viewport = carousel.querySelector('.carousel-viewport');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const prevBtn = carousel.querySelector('[data-carousel-prev]');
        const nextBtn = carousel.querySelector('[data-carousel-next]');
        if (!viewport) return;

        let dots = [];

        function getPageWidth() {
            return Math.max(1, viewport.clientWidth);
        }

        function getPageCount() {
            const pageWidth = getPageWidth();
            const maxScroll = Math.max(0, viewport.scrollWidth - pageWidth);
            return Math.max(1, Math.round(maxScroll / pageWidth) + 1);
        }

        function getActivePage() {
            const pageWidth = getPageWidth();
            return Math.min(getPageCount() - 1, Math.max(0, Math.round(viewport.scrollLeft / pageWidth)));
        }

        function scrollToPage(index) {
            const pageWidth = getPageWidth();
            viewport.scrollTo({ left: index * pageWidth, behavior: 'smooth' });
        }

        function renderDots() {
            if (!dotsContainer) return;

            const pageCount = getPageCount();
            dotsContainer.innerHTML = '';
            dots = [];

            for (let i = 0; i < pageCount; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'carousel-dot';
                btn.setAttribute('aria-label', `Перейти к странице ${i + 1}`);
                btn.addEventListener('click', () => scrollToPage(i));
                dotsContainer.appendChild(btn);
                dots.push(btn);
            }
        }

        function updateUI() {
            const active = getActivePage();
            dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === active));

            if (prevBtn) prevBtn.disabled = active <= 0;
            if (nextBtn) nextBtn.disabled = active >= getPageCount() - 1;
        }

        function onPrev() {
            scrollToPage(getActivePage() - 1);
        }

        function onNext() {
            scrollToPage(getActivePage() + 1);
        }

        if (prevBtn) prevBtn.addEventListener('click', onPrev);
        if (nextBtn) nextBtn.addEventListener('click', onNext);

        let resizeTimer;
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                renderDots();
                updateUI();
            }, 150);
        });

        viewport.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateUI);
        }, { passive: true });

        renderDots();
        updateUI();
    });
}

/**
 * Initialize contact form with validation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('.form-success');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // Validate form
        let isValid = true;
        const formData = new FormData(form);
        
        // Name validation
        const name = formData.get('name')?.trim();
        if (!name || name.length < 2) {
            showError('name', 'Пожалуйста, укажите имя');
            isValid = false;
        }

        // Contact validation (phone or email)
        const contact = formData.get('contact')?.trim();
        if (!contact) {
            showError('contact', 'Пожалуйста, укажите телефон или email');
            isValid = false;
        } else if (!isValidContact(contact)) {
            showError('contact', 'Укажите корректный телефон или email');
            isValid = false;
        }

        // Message validation
        const message = formData.get('message')?.trim();
        if (!message || message.length < 10) {
            showError('message', 'Пожалуйста, опишите запрос (минимум 10 символов)');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateSubmission(formData);
            
            // Show success message
            form.reset();
            if (successMessage) {
                successMessage.classList.add('show');
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function showError(fieldName, message) {
        const group = form.querySelector(`[name="${fieldName}"]`)?.closest('.form-group');
        if (group) {
            group.classList.add('error');
            const errorEl = group.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = message;
            }
        }
    }

    function isValidContact(value) {
        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;

        // Check if it's a valid phone (basic check)
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        return phoneRegex.test(value);
    }

    function simulateSubmission(formData) {
        return new Promise((resolve) => {
            // In production, replace with actual API call:
            // return fetch('/api/contact', { method: 'POST', body: formData });
            setTimeout(resolve, 1500);
        });
    }
}

/**
 * Track click events for analytics
 */
function trackEvent(category, action, label = '') {
    // Yandex.Metrika integration:
    // if (typeof ym !== 'undefined') {
    //     ym(COUNTER_ID, 'reachGoal', action, { category, label });
    // }
    
    console.log('Event tracked:', { category, action, label });
}

// Add click tracking to CTA buttons
document.querySelectorAll('.button.primary, .button.white').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        trackEvent('CTA', 'click', buttonText);
    });
});
