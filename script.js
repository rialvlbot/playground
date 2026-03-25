/* ═══════════════════════════════════════════════
   MADE BY MAGES — Main Script
   ═══════════════════════════════════════════════ */

'use strict';

// ── NAV: scroll shadow + mobile toggle ──
const header    = document.getElementById('top')?.closest('header') ?? document.querySelector('.site-header');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.innerHTML = open ? '&times;' : '&#9776;';
});

// Close mobile nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.innerHTML = '&#9776;';
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── PRODUCT FILTER ──
const filterBtns  = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('revealed');
        requestAnimationFrame(() => card.classList.add('revealed'));
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const delay = entry.target.dataset.revealDelay ?? 0;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

// Apply reveal class + stagger delays to animatable elements
function initReveal() {
  // Section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Product cards (staggered)
  document.querySelectorAll('.product-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 80;
    revealObserver.observe(el);
  });

  // Step cards (staggered)
  document.querySelectorAll('.step-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 120;
    revealObserver.observe(el);
  });

  // Testimonial cards (staggered)
  document.querySelectorAll('.testimonial-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 100;
    revealObserver.observe(el);
  });

  // Consign details
  document.querySelectorAll('.consign-detail-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 80;
    revealObserver.observe(el);
  });

  // About container columns
  document.querySelectorAll('.about-image-col, .about-text-col').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 150;
    revealObserver.observe(el);
  });

  // Contact layout children
  document.querySelectorAll('.contact-form, .contact-info-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = i * 100;
    revealObserver.observe(el);
  });
}

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.querySelector('#name').value.trim();
  const email   = contactForm.querySelector('#email').value.trim();
  const message = contactForm.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    // Shake invalid fields
    [{ id: 'name', val: name }, { id: 'email', val: email }, { id: 'message', val: message }]
      .filter(f => !f.val)
      .forEach(f => shakeField(contactForm.querySelector(`#${f.id}`)));
    return;
  }

  // Simulate submission
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    formSuccess.classList.add('visible');
    contactForm.reset();
    submitBtn.textContent = 'Dispatch the Raven';
    submitBtn.disabled = false;

    setTimeout(() => formSuccess.classList.remove('visible'), 6000);
  }, 900);
});

function shakeField(el) {
  if (!el) return;
  el.style.borderColor = '#c0392b';
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(0)' },
  ], { duration: 300, easing: 'ease-in-out' });

  el.addEventListener('input', () => {
    el.style.borderColor = '';
  }, { once: true });
}

// ── NEWSLETTER FORM ──
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = newsletterForm.querySelector('button');
  btn.textContent = 'Joined! ✦';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Join';
    btn.disabled = false;
    newsletterForm.reset();
  }, 3000);
});

// ── ACTIVE NAV LINK based on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
});
