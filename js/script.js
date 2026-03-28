    (() => {
        'use strict';

        // ===== PRELOADER =====
        const hidePreloader = () => {
            const p = document.getElementById('preloader');
            if(p) p.classList.add('hidden');
        };
        window.addEventListener('load', hidePreloader);
        // Hide immediately when DOM is ready - fonts use font-display:swap so no need to wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hidePreloader);
        } else {
            hidePreloader();
        }
        setTimeout(hidePreloader, 1500); // Failsafe timeout

        // ===== CURSOR GLOW =====
        const cursorGlow = document.getElementById('cursorGlow');
        if (window.matchMedia('(hover: hover)').matches) {
            let mouseX = 0, mouseY = 0;
            let glowX = 0, glowY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateCursor() {
                glowX += (mouseX - glowX) * 0.08;
                glowY += (mouseY - glowY) * 0.08;
                cursorGlow.style.left = glowX + 'px';
                cursorGlow.style.top = glowY + 'px';
                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        }

        // ===== NAVBAR =====
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const navOverlay = document.getElementById('navOverlay');

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        function handleScroll() {
            const scrollY = window.scrollY;
            navbar.classList.toggle('scrolled', scrollY > 60);
            document.getElementById('backToTop').classList.toggle('visible', scrollY > 400);
            updateActiveNav();
            revealOnScroll();
            animateCounters();
        }

        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        const closeMenu = () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        navOverlay.addEventListener('click', closeMenu);
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        const sections = document.querySelectorAll('section[id]');
        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 120) {
                    current = section.getAttribute('id');
                }
            });
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        }

        // ===== BACK TO TOP =====
        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ===== REVEAL ON SCROLL =====
        const revealElements = document.querySelectorAll('.reveal');
        function revealOnScroll() {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                if (el.getBoundingClientRect().top < windowHeight - 80) {
                    el.classList.add('active');
                }
            });
        }
        revealOnScroll();

        // ===== COUNTER =====
        const counters = document.querySelectorAll('.counter-number');
        let countersAnimated = false;

        function animateCounters() {
            if (countersAnimated) return;
            const section = document.querySelector('.counter-section');
            if (!section) return;

            if (section.getBoundingClientRect().top < window.innerHeight - 80) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.dataset.target;
                    const duration = 1800;
                    const start = performance.now();

                    function update(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.ceil(eased * target) + '+';
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                });
            }
        }

        // ===== PRODUCT FILTER =====
        const filterBtns = document.querySelectorAll('.product-filter');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                productCards.forEach((card, i) => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    if (show) {
                        card.style.display = '';
                        card.style.animation = `fadeInUp 0.5s ease ${i * 0.1}s both`;
                    } else {
                        card.style.animation = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => { card.style.display = 'none'; }, 250);
                    }
                });
            });
        });

        // ===== TESTIMONIALS SLIDER =====
        const track = document.getElementById('testimonialsTrack');
        const dots = document.querySelectorAll('.testimonial-dot');
        let currentSlide = 0;
        const totalSlides = dots.length;
        let autoSlideInterval;

        function goToSlide(index) {
            currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, i) => { dot.classList.toggle('active', i === currentSlide); });
        }

        document.getElementById('prevTestimonial').addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        });

        document.getElementById('nextTestimonial').addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(+dot.dataset.index);
                resetAutoSlide();
            });
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        }, { passive: true });

        // ===== TOAST =====
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMessage');
            const toastIcon = toast.querySelector('.toast-icon');

            toastMsg.textContent = message;
            toastIcon.className = `toast-icon ${type}`;
            toastIcon.innerHTML = type === 'success'
                ? '<i class="fas fa-check"></i>'
                : '<i class="fas fa-info"></i>';

            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }

        // ===== CONTACT FORM =====
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formSuccess = document.getElementById('formSuccess');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            submitBtn.classList.add('sending');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                showToast('Your message has been sent successfully!');
                submitBtn.classList.remove('sending');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

                setTimeout(() => {
                    contactForm.style.display = '';
                    formSuccess.classList.remove('show');
                    contactForm.reset();
                }, 5000);
            }, 1500);
        });

        // ===== NEWSLETTER =====
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing!', 'info');
            e.target.reset();
        });

        // ===== LANGUAGE SWITCH =====
        const langBtns = document.querySelectorAll('.lang-btn');
        const translations = {
            en: {
                heroTitle: 'PT. <span class="highlight">Puri Pertiwi</span><br>International',
                heroSubtitle: 'Engaged in Trading, Agriculture, Farm, Production & Software Application',
                heroTagline: '"Light Of Easy Life"',
                heroCta1: 'Discover More',
                heroCta2: 'Contact Us'
            },
            id: {
                heroTitle: 'PT. <span class="highlight">Puri Pertiwi</span><br>International',
                heroSubtitle: 'Bergerak di bidang Perdagangan, Pertanian, Peternakan, Produksi & Aplikasi Perangkat Lunak',
                heroTagline: '"Cahaya Kehidupan Mudah"',
                heroCta1: 'Selengkapnya',
                heroCta2: 'Hubungi Kami'
            }
        };

        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const lang = btn.dataset.lang;
                const t = translations[lang];
                if (!t) return;

                document.querySelector('.hero-title').innerHTML = t.heroTitle;
                document.querySelector('.hero-subtitle').textContent = t.heroSubtitle;
                document.querySelector('.hero-tagline').textContent = t.heroTagline;

                const btns = document.querySelectorAll('.hero-buttons .btn span');
                if (btns[0]) btns[0].textContent = t.heroCta1;
                if (btns[1]) btns[1].textContent = t.heroCta2;

                showToast(`Language switched to ${lang === 'en' ? 'English' : 'Bahasa Indonesia'}`, 'info');
            });
        });

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // ===== KEYBOARD NAV =====
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

    })();
