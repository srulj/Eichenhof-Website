    /**
 * Restaurant Eichenhof - Front-End Logic
 * Updated: May 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. SELECTORS
    // ==========================================================================
    const header = document.getElementById('main-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroBg = document.getElementById('hero-bg');
    
    // Form selectors
    const contactForm = document.getElementById('contact-form');
    const contactFeedback = document.getElementById('contact-feedback');
    const privacyLink = document.getElementById('consent-privacy-link');
    
    // Scroll and timeline selectors
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const sections = document.querySelectorAll('section');

    // ==========================================================================
    // 2. STICKY HEADER & HERO PARALLAX
    // ==========================================================================
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (heroBg) {
            const scrollOffset = window.scrollY;
            if (scrollOffset < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scrollOffset * 0.15}px)`;
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================================================
    // 3. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const navOverlay = document.getElementById('nav-overlay');
    
    // Function to close mobile menu (defined early for use in other handlers)
    const closeMobileMenu = () => {
        if (!navToggle || !navMenu) return;
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.classList.remove('mobile-menu-open');
    };
    
    // Function to toggle mobile menu
    const toggleMobileMenu = () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle overlay
        if (navOverlay) {
            navOverlay.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open
        if (!expanded) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
    };
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================================================
    // 4. INTERSECTION OBSERVER: FADE-IN & SCROLL SPY
    // ==========================================================================
    const sectionObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);

    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    const scrollSpyObserverOptions = {
        threshold: 0.25,
        rootMargin: '-80px 0px -40% 0px'
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    // Match the section id with the nav link href
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, scrollSpyObserverOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // ==========================================================================
    // 5. INTERACTIVE SPEISEN TABS SWITCHER
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const tabPanes = document.querySelectorAll('.menu-tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');

            // Set buttons state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Set panes state
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetTabId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // ==========================================================================
    // 6. GALERIE LIGHTBOX MODAL WITH ZOOM (Pinch & Mouse Wheel)
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    // Zoom state
    let currentZoom = 1;
    const zoomStep = 0.25;
    const minZoom = 0.5;
    const maxZoom = 5;

    // Pinch-to-zoom state for mobile
    let initialPinchDistance = 0;
    let initialZoom = 1;
    let isPinching = false;

    // Function to open lightbox with image
    const openLightbox = (imgSrc, imgTitle, imgCat) => {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgTitle;
        lightboxCaption.innerHTML = `<strong>${imgTitle}</strong> &mdash; ${imgCat}`;
        
        // Reset zoom when opening new image
        currentZoom = 1;
        updateZoom();
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock body scrolling
    };

    // Function to update zoom level
    const updateZoom = () => {
        lightboxImg.style.transform = `scale(${currentZoom})`;
    };

    // Zoom in function
    const zoomIn = () => {
        if (currentZoom < maxZoom) {
            currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
            updateZoom();
        }
    };

    // Zoom out function
    const zoomOut = () => {
        if (currentZoom > minZoom) {
            currentZoom = Math.max(currentZoom - zoomStep, minZoom);
            updateZoom();
        }
    };

    // Reset zoom function
    const resetZoom = () => {
        currentZoom = 1;
        updateZoom();
    };

    // Calculate distance between two touch points
    const getPinchDistance = (touch1, touch2) => {
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    if (lightboxModal && lightboxImg && lightboxClose) {
        // Gallery item click handlers
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-image');
                const imgTitle = item.getAttribute('data-title');
                const imgCat = item.getAttribute('data-category');
                openLightbox(imgSrc, imgTitle, imgCat);
            });
        });

        // Close lightbox function
        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scrolling
            setTimeout(() => {
                lightboxImg.src = '';
                resetZoom();
            }, 300);
        };

        // Close button
        lightboxClose.addEventListener('click', closeLightbox);
        
        // Click outside to close
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // ========================================
        // MOUSE WHEEL ZOOM (PC)
        // ========================================
        lightboxModal.addEventListener('wheel', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            
            e.preventDefault();
            
            if (e.deltaY < 0) {
                // Scroll up = zoom in
                zoomIn();
            } else {
                // Scroll down = zoom out
                zoomOut();
            }
        }, { passive: false });

        // ========================================
        // PINCH-TO-ZOOM (Mobile Touch Gestures)
        // ========================================
        let touchStartCount = 0;
        
        lightboxImg.addEventListener('touchstart', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            
            touchStartCount = e.touches.length;
            
            if (e.touches.length === 2) {
                // Pinch gesture started
                isPinching = true;
                initialPinchDistance = getPinchDistance(e.touches[0], e.touches[1]);
                initialZoom = currentZoom;
                e.preventDefault();
            }
        }, { passive: false });

        lightboxImg.addEventListener('touchmove', (e) => {
            if (!lightboxModal.classList.contains('active') || !isPinching) return;
            
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const currentPinchDistance = getPinchDistance(e.touches[0], e.touches[1]);
                const scale = currentPinchDistance / initialPinchDistance;
                
                // Calculate new zoom level
                let newZoom = initialZoom * scale;
                
                // Clamp zoom level
                newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));
                
                currentZoom = newZoom;
                updateZoom();
            }
        }, { passive: false });

        lightboxImg.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                isPinching = false;
            }
        });

        lightboxImg.addEventListener('touchcancel', (e) => {
            isPinching = false;
        });

        // Keyboard navigation - only Escape to close
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Expose openLightbox globally for menu flyer cards
        window.openLightbox = openLightbox;
    }

    // ==========================================================================
    // 7. SCROLL TO RESERVATION FORM (Fix mobile CTA scroll target)
    // ==========================================================================
    // Handle all "Tisch reservieren" links to scroll to the form, not the section top
    const reservationLinks = document.querySelectorAll('a[href="#contact-section"]');
    const reservationFormContainer = document.querySelector('.reservation-form-container');
    
    reservationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // On mobile, scroll directly to the reservation form
            // On desktop, also scroll to the form for better UX
            if (reservationFormContainer) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = reservationFormContainer.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Focus the first input field after scrolling
                setTimeout(() => {
                    const firstInput = reservationFormContainer.querySelector('input, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            } else {
                // Fallback to default behavior
                const contactSection = document.getElementById('contact-section');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ==========================================================================
    // 8. CONTACT FORM VALIDATION & INTERACTION
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous feedback
            contactFeedback.classList.remove('success');
            contactFeedback.style.display = 'none';

            // Validate consent
            const consent = document.getElementById('contact-consent');
            if (!consent.checked) {
                contactFeedback.innerHTML = 'Bitte stimmen Sie den Datenschutzbestimmungen zu, um fortzufahren.';
                contactFeedback.style.backgroundColor = 'rgba(176, 91, 69, 0.1)';
                contactFeedback.style.color = 'var(--color-terracotta)';
                contactFeedback.style.borderColor = 'var(--color-terracotta)';
                contactFeedback.classList.add('success');
                consent.focus();
                return;
            }

            // Perform native validation check
            if (!contactForm.checkValidity()) {
                const firstInvalid = contactForm.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }

                contactFeedback.innerHTML = 'Bitte füllen Sie alle erforderlichen Felder (*) korrekt aus. Die Anfrage muss mindestens 10 Zeichen lang sein.';
                contactFeedback.style.backgroundColor = 'rgba(176, 91, 69, 0.1)';
                contactFeedback.style.color = 'var(--color-terracotta)';
                contactFeedback.style.borderColor = 'var(--color-terracotta)';
                contactFeedback.classList.add('success');
                return;
            }

            // Gather inputs
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const street = document.getElementById('contact-street').value;
            const zip = document.getElementById('contact-zip').value;
            const fax = document.getElementById('contact-fax').value;
            const message = document.getElementById('contact-message').value;

            // Submit loading animation
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Nachricht wird gesendet...';

            setTimeout(() => {
                // Success output
                contactFeedback.innerHTML = `
                    <strong>Vielen Dank für Ihre Anfrage, ${name}!</strong><br>
                    Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich unter der Adresse <strong>${email}</strong> ${phone ? `oder telefonisch unter <strong>${phone}</strong>` : ''} bei Ihnen melden.
                `;
                contactFeedback.style.backgroundColor = 'rgba(45, 106, 79, 0.1)';
                contactFeedback.style.color = 'var(--color-primary-green)';
                contactFeedback.style.borderColor = 'var(--color-primary-light)';
                contactFeedback.classList.add('success');

                // Form reset
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Anfrage senden';

                // Scroll view to confirmation message
                contactFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }

    // ==========================================================================
    // 8. LEGAL ACCORDIONS / STUB MODALS (IMPRESSUM & DATENSCHUTZ)
    // ==========================================================================
    const impressumBtn = document.getElementById('legal-impressum');
    const privacyBtn = document.getElementById('legal-privacy');
    
    // Quick-link privacy helper in the consent checkbox label
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (privacyBtn) privacyBtn.click();
        });
    }
    
    const showLegalNotice = (title, content) => {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(8, 28, 21, 0.85)';
        modal.style.backdropFilter = 'blur(5px)';
        modal.style.zIndex = '2500';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '24px';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';

        const card = document.createElement('div');
        card.style.backgroundColor = 'var(--color-cream)';
        card.style.maxWidth = '600px';
        card.style.width = '100%';
        card.style.maxHeight = '80vh';
        card.style.overflowY = 'auto';
        card.style.padding = '40px';
        card.style.borderRadius = '8px';
        card.style.boxShadow = 'var(--shadow-strong)';
        card.style.position = 'relative';
        card.style.transform = 'translateY(-20px)';
        card.style.transition = 'transform 0.3s ease';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '15px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'var(--color-primary-dark)';

        const heading = document.createElement('h3');
        heading.textContent = title;
        heading.style.fontSize = '2.2rem';
        heading.style.marginBottom = '20px';
        heading.style.borderBottom = '1px solid var(--color-border)';
        heading.style.paddingBottom = '10px';

        const bodyText = document.createElement('div');
        bodyText.innerHTML = content;
        bodyText.style.fontSize = '0.95rem';
        bodyText.style.color = '#4a4d50';

        card.appendChild(closeBtn);
        card.appendChild(heading);
        card.appendChild(bodyText);
        modal.appendChild(card);
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 10);

        const closeModal = () => {
            modal.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    };

    if (impressumBtn) {
        impressumBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLegalNotice(
                'Impressum', 
                `<p><strong>Restaurant Eichenhof Hamburg</strong><br>
                Inhaber: Ejup Fetahu<br>
                Bremer Straße 320, 21077 Hamburg (Appelbüttel)</p>
                
                <p style="margin-top: 15px;"><strong>Kontakt:</strong><br>
                Telefon: 040 / 760 34 83<br>
                Fax: 040 / 761 120 25<br>
                E-Mail: restaurant-eichenhof@t-online.de</p>
                
                <p style="margin-top: 15px;"><strong>Steuernummer:</strong><br>
                47/060/01323</p>
                
                <p style="margin-top: 15px;"><strong>Aufsichtsbehörde:</strong><br>
                Freie Hansestadt Hamburg Bezirksamt Harburg<br>
                Verbraucherschutz, Gewerbe, Umwelt<br>
                Knoopstraße 35, 21073 Hamburg<br>
                Tel.: 040 / 4 28 71-22 26</p>
                
                <p style="margin-top: 20px; font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 10px;">
                <strong>Urheberrechtshinweis:</strong><br>
                Die Seiten des Internet-Auftritts unterliegen urheberrechtlichem Schutz. Vervielfältigungen sowie Einspeicherung und Verarbeitung in anderen elektronischen Medien sind urheberrechtlich geschützt. Nachahmung und Verwertung – auch auszugsweise – sind nur mit Genehmigung gestattet. Inhalt und Struktur der Website sind urheberrechtlich geschützt. Die Verwendung von Texten, Textteilen oder Bildmaterial bedarf der vorherigen schriftlichen Zustimmung.
                </p>`
            );
        });
    }

    if (privacyBtn) {
        privacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLegalNotice(
                'Datenschutzerklärung',
                `<p><strong>1. Datenschutz auf einen Blick</strong></p>
                <p style="margin-top: 10px;">Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung behandelt.</p>
                
                <p style="margin-top: 15px;"><strong>2. Datenerfassung auf unserer Website</strong></p>
                <p style="margin-top: 10px;">Diese Internetseite bietet ein Online-Formular zur unverbindlichen Kontaktaufnahme. Die von Ihnen im Formular eingetippten Daten (Name, Telefon, Straße, PLZ, E-Mail, Fax, Ihre Anfrage) werden ausschließlich zur Bearbeitung und Beantwortung Ihrer Kontaktaufnahme erhoben. Eine Weitergabe an Dritte erfolgt nicht.</p>
                
                <p style="margin-top: 15px;"><strong>3. Ihre Rechte</strong></p>
                <p style="margin-top: 10px;">Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Wenden Sie sich hierzu bitte an die im Impressum angegebene Adresse.</p>`
            );
        });
    }
});