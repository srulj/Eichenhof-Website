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
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
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
                    if (href === `#${activeId}` || (activeId === 'hero' && href === '#about')) {
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
    // 6. GALERIE LIGHTBOX MODAL
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightboxModal && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-image');
                const imgTitle = item.getAttribute('data-title');
                const imgCat = item.getAttribute('data-category');

                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgTitle;
                lightboxCaption.innerHTML = `<strong>${imgTitle}</strong> &mdash; ${imgCat}`;
                
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock body scrolling
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scrolling
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ==========================================================================
    // 7. CONTACT FORM VALIDATION & INTERACTION
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