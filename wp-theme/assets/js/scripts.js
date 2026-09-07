/**
 * Main JavaScript for Apex Consulting Theme
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        
        // ============================================
        // Initialize GSAP Plugins
        // ============================================
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // ============================================
        // Smooth Scrolling with Lenis
        // ============================================
        let lenis;
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: function(t) {
                    return Math.min(1, 1.001 - Math.pow(2, -10 * t));
                },
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false
            });
            
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            
            requestAnimationFrame(raf);
            
            // Sync with GSAP ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
            }
        }
        
        // ============================================
        // Scroll Progress Bar
        // ============================================
        const progressBar = document.getElementById('scroll-progress');
        
        function updateProgressBar() {
            if (!progressBar) return;
            
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar();
        
        // ============================================
        // Current Section Indicator
        // ============================================
        const sectionIds = ['hero', 'about', 'services', 'process', 'case-studies', 'insights', 'team', 'contact'];
        const currentSectionEl = document.getElementById('current-section');
        
        function updateCurrentSection() {
            if (!currentSectionEl) return;
            
            const scrollPos = window.scrollY + window.innerHeight / 2;
            
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.getElementById(sectionIds[i]);
                if (section && section.offsetTop <= scrollPos) {
                    const sectionName = sectionIds[i].replace('-', ' ');
                    currentSectionEl.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
                    break;
                }
            }
        }
        
        window.addEventListener('scroll', updateCurrentSection);
        updateCurrentSection();
        
        // ============================================
        // Mobile Menu Toggle
        // ============================================
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });
        }
        
        // ============================================
        // Custom Cursor (Desktop Only)
        // ============================================
        const customCursor = document.getElementById('custom-cursor');
        
        if (customCursor && window.matchMedia('(min-width: 768px)').matches) {
            document.addEventListener('mousemove', function(e) {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            
            // Add hover effects to interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .service-card, .case-study-card, .insight-card, .team-card');
            
            interactiveElements.forEach(function(el) {
                el.addEventListener('mouseenter', function() {
                    customCursor.style.transform = 'scale(2)';
                });
                
                el.addEventListener('mouseleave', function() {
                    customCursor.style.transform = 'scale(1)';
                });
            });
        } else if (customCursor) {
            customCursor.style.display = 'none';
        }
        
        // ============================================
        // Hero Section Animations
        // ============================================
        const heroSection = document.getElementById('hero');
        const heroTitle = heroSection ? heroSection.querySelector('.hero-title') : null;
        const heroTagline = heroSection ? heroSection.querySelector('.hero-tagline') : null;
        const heroCta = heroSection ? heroSection.querySelector('.hero-cta') : null;
        const scrollIndicator = heroSection ? heroSection.querySelector('.scroll-indicator') : null;
        
        if (typeof gsap !== 'undefined' && heroSection) {
            // Initial animations
            gsap.from(heroTitle, {
                opacity: 0,
                y: 50,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.2
            });
            
            gsap.from(heroTagline, {
                opacity: 0,
                y: 30,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.4
            });
            
            gsap.from(heroCta, {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: 'back.out(1.7)',
                delay: 0.6
            });
            
            // Scroll-triggered animations
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.to(heroSection.querySelector('.hero-canvas'), {
                    scrollTrigger: {
                        trigger: heroSection,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    },
                    scale: 1.5,
                    ease: 'power2.inOut'
                });
                
                gsap.to(heroTitle, {
                    scrollTrigger: {
                        trigger: heroSection,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    },
                    filter: 'blur(10px)',
                    opacity: 0.8,
                    y: -100,
                    ease: 'power2.inOut'
                });
                
                gsap.to(scrollIndicator, {
                    scrollTrigger: {
                        trigger: heroSection,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    },
                    opacity: 0,
                    y: 50,
                    scale: 0.5,
                    ease: 'power2.in'
                });
            }
        }
        
        // ============================================
        // About Section Animations
        // ============================================
        const aboutSection = document.getElementById('about');
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && aboutSection) {
            const magneticWords = aboutSection.querySelectorAll('.magnetic-word');
            
            magneticWords.forEach(function(word) {
                ScrollTrigger.create({
                    trigger: word,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: function() {
                        gsap.to(word, {
                            scale: 1.05,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    },
                    onLeaveBack: function() {
                        gsap.to(word, {
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });
            });
            
            gsap.from(aboutSection.querySelectorAll('.about-text > *, .about-card'), {
                scrollTrigger: {
                    trigger: aboutSection,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    scrub: 1
                },
                y: 100,
                opacity: 0,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.5)'
            });
        }
        
        // ============================================
        // Services Section Animations
        // ============================================
        const servicesSection = document.getElementById('services');
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && servicesSection) {
            const serviceCards = servicesSection.querySelectorAll('.service-card');
            
            serviceCards.forEach(function(card, index) {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1
                    },
                    x: Math.cos(index * 60 * (Math.PI / 180)) * 200,
                    y: Math.sin(index * 60 * (Math.PI / 180)) * 200,
                    opacity: 0,
                    rotation: index * 30,
                    ease: 'power2.out'
                });
            });
            
            // Geometry morphing
            const geometry = servicesSection.querySelector('.services-geometry');
            if (geometry) {
                gsap.to(geometry, {
                    scrollTrigger: {
                        trigger: servicesSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    },
                    rotateX: 360,
                    rotateY: 360,
                    scale: 1.2,
                    ease: 'none'
                });
            }
        }
        
        // ============================================
        // Contact Form Handler
        // ============================================
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitBtn = this.querySelector('.submit-btn');
                
                // Animate button on submit
                if (typeof gsap !== 'undefined') {
                    gsap.to(submitBtn, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                }
                
                // Here you would typically send the form data via AJAX
                // For now, we'll just show a success message
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            });
        }
        
        // ============================================
        // Insights Filter Buttons
        // ============================================
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Here you would filter the insights based on category
                // For demo purposes, we'll just animate the cards
                if (typeof gsap !== 'undefined') {
                    const insightCards = document.querySelectorAll('.insight-card');
                    gsap.to(insightCards, {
                        scale: 0.95,
                        opacity: 0.5,
                        duration: 0.3,
                        onComplete: function() {
                            gsap.to(insightCards, {
                                scale: 1,
                                opacity: 1,
                                duration: 0.3
                            });
                        }
                    });
                }
            });
        });
        
        // ============================================
        // Three.js Hero Background (Simplified)
        // ============================================
        const heroCanvas = document.getElementById('hero-canvas');
        
        if (typeof THREE !== 'undefined' && heroCanvas) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            heroCanvas.appendChild(renderer.domElement);
            
            // Create particle system
            const particleCount = 8000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            const color1 = new THREE.Color('#d4af37');
            const color2 = new THREE.Color('#14b8a6');
            const color3 = new THREE.Color('#1e3a5f');
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 100;
                positions[i3 + 1] = (Math.random() - 0.5) * 100;
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
                
                const mixedColor = color1.clone().lerp(color2, Math.random()).lerp(color3, Math.random());
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.1,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });
            
            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            
            camera.position.z = 30;
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight1 = new THREE.PointLight(0xd4af37, 1);
            pointLight1.position.set(10, 10, 10);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0x14b8a6, 0.5);
            pointLight2.position.set(-10, -10, -10);
            scene.add(pointLight2);
            
            // Animation loop
            let time = 0;
            
            function animate() {
                requestAnimationFrame(animate);
                
                time += 0.001;
                
                // Slowly rotate particles
                particles.rotation.y = time * 0.5;
                particles.rotation.x = time * 0.2;
                
                renderer.render(scene, camera);
            }
            
            animate();
            
            // Handle resize
            window.addEventListener('resize', function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
        
        // ============================================
        // Starfield Generation
        // ============================================
        const starfield = document.getElementById('starfield');
        
        if (starfield) {
            // Stars are already generated in PHP, but we can add interactivity here
            const stars = starfield.querySelectorAll('.starfield-star');
            
            stars.forEach(function(star, index) {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    gsap.from(star, {
                        scrollTrigger: {
                            trigger: starfield,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1
                        },
                        scale: 0,
                        opacity: 0,
                        delay: index * 0.01,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        }
        
    });
    
})();
