// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbar    = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

// Scroll: add 'scrolled' class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── ENHANCED MOBILE MENU (iOS Safari optimized) ─────────────────────────────
// Comprehensive mobile menu solution with iOS-specific fixes
let scrollPosition = 0;

function isMobileMenuActive() {
  return navLinks && navLinks.classList.contains('open');
}

function openMenu() {
  if (!navLinks || !navToggle) return;
  
  // Store current scroll position
  scrollPosition = window.pageYOffset;
  
  // Add classes and prevent body scroll
  navLinks.classList.add('open');
  navToggle.classList.add('active');
  document.body.classList.add('menu-open');
  
  // iOS-specific body locking
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  
  // Animate hamburger
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
  spans[1].style.opacity = '0';
  spans[1].style.transform = 'translateX(20px)';
  spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
  
  // Accessibility
  navToggle.setAttribute('aria-expanded', 'true');
  navLinks.setAttribute('aria-hidden', 'false');
  
  // Focus management
  setTimeout(() => {
    const firstLink = navLinks.querySelector('a');
    if (firstLink) firstLink.focus();
  }, 300);
}

function closeMenu() {
  if (!navLinks || !navToggle) return;
  
  // Remove classes
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  document.body.classList.remove('menu-open');
  
  // Restore body scroll
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  
  // Restore scroll position (iOS fix)
  window.scrollTo(0, scrollPosition);
  
  // Reset hamburger
  const spans = navToggle.querySelectorAll('span');
  spans.forEach(s => {
    s.style.transform = '';
    s.style.opacity = '';
  });
  
  // Accessibility
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.setAttribute('aria-hidden', 'true');
  
  // Return focus to toggle button
  navToggle.focus();
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    isMobileMenuActive() ? closeMenu() : openMenu();
  });
}

// Close on any nav link tap (important on iOS — no hover state)
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ─── MOBILE ENHANCEMENTS ─────────────────────────────────────────────────────
// Handle orientation changes (close menu on rotation)
window.addEventListener('orientationchange', () => {
  if (isMobileMenuActive()) {
    closeMenu();
  }
  // iOS viewport fix - recalculate height after orientation change
  setTimeout(() => {
    if (navLinks) {
      navLinks.style.height = window.innerHeight + 'px';
    }
  }, 500);
});

// Handle resize events (close menu if window gets too wide)
window.addEventListener('resize', () => {
  if (window.innerWidth > 640 && isMobileMenuActive()) {
    closeMenu();
  }
});

// Prevent iOS bounce scroll when menu is open
document.addEventListener('touchmove', (e) => {
  if (isMobileMenuActive() && !e.target.closest('.nav-links')) {
    e.preventDefault();
  }
}, { passive: false });

// iOS viewport height fix
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial value and update on resize/orientation change
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 100));

// ─── ACTIVE NAV LINK ──────────────────────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ─── REVEAL ON SCROLL ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── CONTACT FORM VALIDATION ──────────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.form-error');
      const isEmpty = !field.value.trim();
      const isBadEmail = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (isEmpty || isBadEmail) {
        field.classList.add('error');
        if (err) err.textContent = isEmpty ? 'This field is required.' : 'Please enter a valid email.';
        valid = false;
      } else {
        field.classList.remove('error');
        if (err) err.textContent = '';
      }
    });
    const msg = document.getElementById('formMessage');
    if (valid) {
      msg.className   = 'form-message success';
      msg.textContent = "✓ Message sent! I'll get back to you within 24 hours.";
      form.reset();
    } else {
      msg.className   = 'form-message error-msg';
      msg.textContent = '✗ Please fix the errors above.';
    }
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const err = field.parentElement.querySelector('.form-error');
      if (err) err.textContent = '';
    });
  });
}
