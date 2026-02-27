// Navigation & Scroll Effects
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
});

// Mobile menu helpers
function closeMobileMenu() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  // iOS Safari scroll position fix
  if (window.scrollPosition !== undefined) {
    window.scrollTo(0, window.scrollPosition);
  }
}

function openMobileMenu() {
  // iOS Safari scroll lock fix
  window.scrollPosition = window.pageYOffset;
  navLinks.classList.add('open');
  navToggle.classList.add('active');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${window.scrollPosition}px`;
  document.body.style.width = '100%';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

// Close menu when a nav link is tapped
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

// Active nav link highlight
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form validation
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const fields = form.querySelectorAll('[required]');
    fields.forEach(field => {
      const err = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        field.classList.add('error');
        if (err) err.textContent = 'This field is required.';
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('error');
        if (err) err.textContent = 'Please enter a valid email.';
        valid = false;
      } else {
        field.classList.remove('error');
        if (err) err.textContent = '';
      }
    });
    const msg = document.getElementById('formMessage');
    if (valid) {
      msg.className = 'form-message success';
      msg.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
      form.reset();
    } else {
      msg.className = 'form-message error-msg';
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
