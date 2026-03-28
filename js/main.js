/* =============================================
   DOCES DA KEMILLI — Main JavaScript
   ============================================= */

'use strict';

/* =========== NAVBAR SCROLL =========== */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* =========== MOBILE MENU =========== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu when clicking links
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* =========== HERO PARTICLES =========== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const particleCount = 20;
  const colors = ['#c8956c', '#e8b98a', '#f5d6cb', '#a07040', '#d4a56a'];

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';

    const size = Math.random() * 8 + 3;
    const leftPos = Math.random() * 100;
    const dur = Math.random() * 8 + 6;
    const delay = Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${leftPos}%;
      --dur: ${dur}s;
      --delay: ${delay}s;
      background: ${color};
      border-radius: 50%;
    `;

    container.appendChild(p);
  }

  // Also add some Easter-themed emojis as particles
  const emojis = ['🍫', '🐣', '🌸', '✨', '🐰', '🌷'];
  for (let i = 0; i < 6; i++) {
    const e = document.createElement('div');
    e.style.cssText = `
      position: absolute;
      left: ${Math.random() * 90 + 5}%;
      font-size: ${Math.random() * 12 + 10}px;
      opacity: 0;
      animation: floatParticle ${Math.random() * 10 + 8}s ${Math.random() * 8}s ease-in-out infinite;
    `;
    e.textContent = emojis[i];
    container.appendChild(e);
  }
}

createParticles();

/* =========== COUNTDOWN TIMER =========== */
// Set Easter 2026 deadline (April 1, 2026 midnight - Brazil time)
const EASTER_DEADLINE = new Date('2026-04-01T00:00:00-03:00');
// Order deadline: 5 days before Easter
const ORDER_DEADLINE = new Date(EASTER_DEADLINE);
ORDER_DEADLINE.setDate(ORDER_DEADLINE.getDate() - 5);

function updateCountdown() {
  const now = new Date();
  const diff = ORDER_DEADLINE - now;

  if (diff <= 0) {
    // Deadline passed
    ['cdDays', 'cdHours', 'cdMins', 'cdSecs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    document.getElementById('ribbonCountdown').textContent = 'Encerrado';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');

  const prevSecs = document.getElementById('cdSecs')?.textContent;

  setCountdownEl('cdDays', pad(days));
  setCountdownEl('cdHours', pad(hours));
  setCountdownEl('cdMins', pad(mins));
  setCountdownEl('cdSecs', pad(secs));

  // Ribbon countdown
  const ribbon = document.getElementById('ribbonCountdown');
  if (ribbon) {
    ribbon.textContent = `${pad(days)}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  }

  // Add flip animation on second change
  if (prevSecs !== pad(secs)) {
    const secsEl = document.getElementById('cdSecs');
    if (secsEl) {
      secsEl.classList.remove('flip');
      void secsEl.offsetWidth;
      secsEl.classList.add('flip');
    }
  }
}

function setCountdownEl(id, value) {
  const el = document.getElementById(id);
  if (el && el.textContent !== value) {
    el.textContent = value;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========== SCROLL REVEAL ANIMATION =========== */
const revealObserverOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, parseInt(delay));

      revealObserver.unobserve(el);
    }
  });
}, revealObserverOptions);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* =========== STOCK BAR ANIMATION =========== */
const stockFill = document.getElementById('stockFill');

const stockObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate to ~75% full (showing urgency - 75% sold)
      setTimeout(() => {
        if (stockFill) stockFill.style.width = '75%';
      }, 400);
      stockObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (stockFill) {
  stockObserver.observe(stockFill.parentElement);
}

/* =========== SMOOTH SCROLL =========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight + 20;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});

/* =========== PRODUCT CARD TILT EFFECT =========== */
function addTiltEffect() {
  const cards = document.querySelectorAll('.product-card, .diff-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Only enable tilt on non-touch devices
if (!('ontouchstart' in window)) {
  addTiltEffect();
}

/* =========== LAZILY LOAD IMAGES =========== */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imgObserver.observe(img);
  });
}

/* =========== ACTIVE NAV LINK HIGHLIGHT =========== */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function updateActiveNavLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

/* =========== FLOATING WA SHOW/HIDE =========== */
const floatingWa = document.querySelector('.floating-wa');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    if (floatingWa) floatingWa.style.opacity = '1';
  } else {
    if (floatingWa) floatingWa.style.opacity = '0.6';
  }
}, { passive: true });

/* =========== GALLERY AUTO-PAUSE ON HOVER =========== */
const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  galleryTrack.addEventListener('mouseenter', () => {
    galleryTrack.style.animationPlayState = 'paused';
  });
  galleryTrack.addEventListener('mouseleave', () => {
    galleryTrack.style.animationPlayState = 'running';
  });
}

/* =========== CONFETTI ON CTA CLICK =========== */
function createConfetti(event) {
  const colors = ['#c8956c', '#f0c8a8', '#25d366', '#ffffff', '#f5d6cb', '#gold'];
  const confettiCount = 30;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      left: ${event.clientX}px;
      top: ${event.clientY}px;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 99999;
      opacity: 1;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(confetti);

    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = Math.random() * 120 + 60;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 100;

    let startTime = null;
    const duration = Math.random() * 800 + 600;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        confetti.remove();
        return;
      }

      const x = vx * progress;
      const y = vy * progress + (0.5 * 600 * progress * progress);
      const opacity = 1 - progress;

      confetti.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${progress * 360}deg)`;
      confetti.style.opacity = opacity;

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
}

// Add confetti to primary CTA buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', createConfetti);
});

/* =========== PAGE LOAD COMPLETE =========== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger initial reveals for elements in view
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);
});

/* =========== SCROLL PROGRESS BAR =========== */
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }
}, { passive: true });

/* =========== ANALYTICS-LIKE SCROLL DEPTH =========== */
let maxScroll = 0;
window.addEventListener('scroll', () => {
  const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent;
  }
}, { passive: true });

console.log('%c🍫 Doces da Kemilli — Páscoa 2026', 'color: #c8956c; font-size: 18px; font-weight: bold;');
console.log('%cFeito com amor em Maracaju, MS ❤️', 'color: #6b3a22; font-size: 12px;');
console.log('%cPara pedir: https://wa.me/5567992577583', 'color: #25d366; font-size: 12px;');
