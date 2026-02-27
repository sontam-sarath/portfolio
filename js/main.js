// Navigation & Scroll Effects
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// Active nav link
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
