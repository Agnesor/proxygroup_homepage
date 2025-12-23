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
    initParallaxSections();
    initHeroSlider();
    initModal();
    initCasesSlider();
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
 * Uses slide-based navigation instead of page-based for accurate scrolling
 */
function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    if (!carousels.length) return;

    carousels.forEach((carousel) => {
        const viewport = carousel.querySelector('.carousel-viewport');
        const track = carousel.querySelector('.carousel-track');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const prevBtn = carousel.querySelector('[data-carousel-prev]');
        const nextBtn = carousel.querySelector('[data-carousel-next]');
        if (!viewport || !track) return;

        let dots = [];

        // Get all slide elements
        function getSlides() {
            return Array.from(track.querySelectorAll('.carousel-slide'));
        }

        // Get the width of a single slide including gap
        function getSlideWidth() {
            const slides = getSlides();
            if (slides.length < 2) return viewport.clientWidth;
            
            // Calculate actual slide width from DOM (includes gap in offset)
            const firstSlide = slides[0];
            const secondSlide = slides[1];
            return secondSlide.offsetLeft - firstSlide.offsetLeft;
        }

        // Calculate how many slides are visible at once
        function getVisibleSlides() {
            const slideWidth = getSlideWidth();
            if (slideWidth <= 0) return 1;
            return Math.max(1, Math.floor(viewport.clientWidth / slideWidth));
        }

        // Get total number of navigation positions (pages)
        function getPageCount() {
            const slides = getSlides();
            const visibleSlides = getVisibleSlides();
            // Pages = total slides - visible slides + 1 (so last page shows last slides)
            return Math.max(1, slides.length - visibleSlides + 1);
        }

        // Get current active page based on scroll position
        function getActivePage() {
            const slideWidth = getSlideWidth();
            if (slideWidth <= 0) return 0;
            
            const scrollPos = viewport.scrollLeft;
            const page = Math.round(scrollPos / slideWidth);
            return Math.min(getPageCount() - 1, Math.max(0, page));
        }

        // Scroll to specific page (slide index)
        function scrollToPage(index) {
            const slides = getSlides();
            if (index < 0 || index >= slides.length) return;
            
            const targetSlide = slides[index];
            if (!targetSlide) return;
            
            viewport.scrollTo({ 
                left: targetSlide.offsetLeft, 
                behavior: 'smooth' 
            });
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
            const pageCount = getPageCount();
            
            dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === active));

            if (prevBtn) prevBtn.disabled = active <= 0;
            if (nextBtn) nextBtn.disabled = active >= pageCount - 1;
        }

        function onPrev() {
            const current = getActivePage();
            if (current > 0) {
                scrollToPage(current - 1);
            }
        }

        function onNext() {
            const current = getActivePage();
            if (current < getPageCount() - 1) {
                scrollToPage(current + 1);
            }
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

        // Initial setup after a brief delay to ensure layout is complete
        requestAnimationFrame(() => {
            renderDots();
            updateUI();
        });
    });
}

/**
 * Initialize contact form with validation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modalForm = document.getElementById('contact-modal-form');
    
    if (form) {
        setupForm(form);
    }
    if (modalForm) {
        setupForm(modalForm);
    }
}

function setupForm(form) {

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

        // Contact validation (phone only)
        const contact = formData.get('contact')?.trim();
        if (!contact) {
            showError('contact', 'Пожалуйста, укажите телефон');
            isValid = false;
        } else if (!isValidPhone(contact)) {
            showError('contact', 'Укажите корректный номер телефона');
            isValid = false;
        }

        // Message is optional, no validation needed

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
                    // Close modal if form is in modal
                    const modal = form.closest('.modal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }, 3000);
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

    function isValidPhone(value) {
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

/**
 * Initialize parallax effect for sections with parallax-hero class
 * Creates sticky effect with next section overlaying
 * Adds rounded corners only when section becomes sticky
 */
function initParallaxSections() {
    // Секции от "Кто мы" до "Кейсы", которые должны иметь закругления при прокрутке
    // Используем querySelectorAll для всех секций с id="when-contact"
    const sectionsToRound = [
        'section#what-we-do',
        'section#when-contact',
        'section#clients',
        'section#assets',
        'section#infrastructure',
        'section#cases'
    ];

    const parallaxSections = document.querySelectorAll('section.parallax-hero');
    if (!parallaxSections.length) return;

    // Проверяем, не мобильное ли устройство
    const isMobile = window.innerWidth <= 768;

    parallaxSections.forEach((section) => {
        // Пропускаем hero-секцию на странице команды (содержит текст "Команда")
        const heroTitle = section.querySelector('h1.hero-title');
        if (heroTitle && heroTitle.textContent.includes('Команда')) {
            section.style.cssText += 'position: static !important;';
            return;
        }
        
        // На мобильных устройствах не применяем sticky позиционирование
        if (!isMobile) {
            // Force sticky positioning via inline styles
            section.style.cssText += 'position: -webkit-sticky !important; position: sticky !important; top: 0 !important; z-index: 10 !important; margin-bottom: 0 !important;';

            // Ensure next section overlays
            const nextSection = section.nextElementSibling;
            if (nextSection && nextSection.tagName === 'SECTION') {
                nextSection.style.cssText += 'position: relative !important; z-index: 20 !important; margin-top: 0 !important;';
            }
        } else {
            // На мобильных устройствах принудительно устанавливаем static
            section.style.cssText += 'position: static !important;';
        }
    });

    // Handle scroll to add rounded corners when sticky
    let ticking = false;
    function updateParallax() {
        // Обрабатываем все секции с указанными ID
        sectionsToRound.forEach(selector => {
            // Для when-contact используем querySelectorAll, так как может быть несколько секций
            const sections = selector === 'section#when-contact' 
                ? document.querySelectorAll(selector)
                : [document.querySelector(selector)].filter(Boolean);
            
            sections.forEach(section => {
                if (!section) return;
                
                const rect = section.getBoundingClientRect();
                const isSticky = rect.top <= 0 && rect.bottom > 0;
                
                if (isSticky) {
                    section.classList.add('sticky-rounded');
                } else {
                    section.classList.remove('sticky-rounded');
                }
            });
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Обработчик изменения размера окна для мобильных устройств
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const isMobileNow = window.innerWidth <= 768;
            parallaxSections.forEach((section) => {
                // Пропускаем hero-секцию на странице команды
                const heroTitle = section.querySelector('h1.hero-title');
                if (heroTitle && heroTitle.textContent.includes('Команда')) {
                    section.style.cssText += 'position: static !important;';
                    return;
                }
                
                if (isMobileNow) {
                    section.style.cssText += 'position: static !important;';
                } else {
                    section.style.cssText += 'position: -webkit-sticky !important; position: sticky !important; top: 0 !important; z-index: 10 !important; margin-bottom: 0 !important;';
                }
            });
        }, 150);
    }, { passive: true });

    // Initial check
    updateParallax();
}

/**
 * Initialize hero slider with automatic image rotation
 * Changes images every 4 seconds with smooth fade transition
 */
function initHeroSlider() {
    const heroSection = document.querySelector('.section-hero.hero-slider');
    if (!heroSection) return;

    const slides = heroSection.querySelectorAll('.hero-slider-slide');
    if (slides.length < 2) return;

    const indicatorsContainer = heroSection.querySelector('.hero-slider-indicators');
    const indicators = [];

    // Создаем индикаторы
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'hero-slider-indicator' + (index === 0 ? ' active' : '');
        indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        indicatorsContainer.appendChild(indicator);
        indicators.push(indicator);
    });

    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateIndicators();
    }

    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        
        // Update indicators
        updateIndicators();
    }

    // Start the slider - работает непрерывно, независимо от наведения мыши
    setInterval(nextSlide, slideInterval);

    // Ensure first slide is visible on load
    if (slides.length > 0) {
        slides[0].classList.add('active');
        updateIndicators();
    }
}

/**
 * Initialize modal functionality
 */
function initModal() {
    // Open modal
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-open');
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modal
    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-close');
            const modal = document.getElementById(modalId);
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize cases slider with navigation arrows and dots
 */
function initCasesSlider() {
    const slider = document.querySelector('section#cases .cases-slider');
    if (!slider) return;

    const prevBtn = document.querySelector('.cases-slider-prev');
    const nextBtn = document.querySelector('.cases-slider-next');
    const dotsContainer = document.querySelector('.cases-slider-dots');
    const slides = slider.querySelectorAll('.case-card');
    
    if (!slides.length) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'cases-slider-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Перейти к кейсу ${index + 1}`);
        dot.addEventListener('click', () => scrollToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.cases-slider-dot');
    const itemsPerView = window.innerWidth <= 768 ? 1 : 3;
    const totalSlides = slides.length;
    let currentIndex = 0;

    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - itemsPerView;
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            const slideIndex = Math.floor(currentIndex / itemsPerView);
            dot.classList.toggle('active', Math.floor(index / itemsPerView) === slideIndex);
        });
    }

    function scrollToSlide(index) {
        const slide = slides[index];
        if (!slide) return;
        
        const slideWidth = slide.offsetWidth + 20; // включая gap
        slider.scrollTo({
            left: index * slideWidth,
            behavior: 'smooth'
        });
        
        currentIndex = index;
        updateButtons();
        updateDots();
    }

    function scrollNext() {
        if (currentIndex < totalSlides - itemsPerView) {
            currentIndex += itemsPerView;
            scrollToSlide(currentIndex);
        }
    }

    function scrollPrev() {
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - itemsPerView);
            scrollToSlide(currentIndex);
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
    if (nextBtn) nextBtn.addEventListener('click', scrollNext);

    // Update on scroll
    slider.addEventListener('scroll', () => {
        const scrollLeft = slider.scrollLeft;
        const slideWidth = slides[0]?.offsetWidth + 20;
        currentIndex = Math.round(scrollLeft / slideWidth);
        updateButtons();
        updateDots();
    }, { passive: true });

    // Update on resize
    window.addEventListener('resize', () => {
        const itemsPerViewNew = window.innerWidth <= 768 ? 1 : 3;
        updateButtons();
    }, { passive: true });

    // Автоматическая прокрутка каждые 4 секунды на 1 кейс
    let autoScrollInterval;
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                currentIndex += 1;
                scrollToSlide(currentIndex);
            } else {
                // Если достигли конца, возвращаемся к началу
                currentIndex = 0;
                scrollToSlide(0);
            }
        }, 4000);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }

    // Останавливаем автопрокрутку при наведении мыши
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
    
    // Останавливаем автопрокрутку при взаимодействии пользователя
    if (prevBtn) prevBtn.addEventListener('mouseenter', stopAutoScroll);
    if (nextBtn) nextBtn.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('touchstart', stopAutoScroll);
    slider.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 4000);
    });

    updateButtons();
    updateDots();
    startAutoScroll();
}
