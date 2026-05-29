/* =========================================================
   COOKIES.JS – Cookie-Banner & Consent-Verwaltung
   ========================================================= */
(function () {
    'use strict';

    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
        setTimeout(() => {
            banner.classList.add('cookie-banner--visible');
            banner.setAttribute('aria-hidden', 'false');
        }, 800);
    } else {
        applyConsent(JSON.parse(savedConsent));
    }

    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
        saveConsent({ necessary: true, maps: true });
    });
    document.getElementById('cookie-accept-selected')?.addEventListener('click', () => {
        const maps = document.getElementById('cookie-maps')?.checked || false;
        saveConsent({ necessary: true, maps });
    });
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
        saveConsent({ necessary: true, maps: false });
    });

    function saveConsent(consent) {
        localStorage.setItem('cookie-consent', JSON.stringify(consent));
        banner.classList.remove('cookie-banner--visible');
        banner.setAttribute('aria-hidden', 'true');
        applyConsent(consent);
    }

    function applyConsent(consent) {
        if (consent.maps) {
            document.querySelectorAll('[data-maps-src]').forEach(el => {
                if (el.tagName === 'IFRAME') el.src = el.dataset.mapsSrc;
            });
        }
    }
})();