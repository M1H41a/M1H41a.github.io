/* ═══════════════════════════
   PERSONAL WEBSITE – main.js
   Cristea Mihai-Cătălin
═══════════════════════════ */

'use strict';

// ─────────────────────────────────────
// PARTICLES (neural network style)
// ─────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomHex() {
    const colors = ['#7c3aed', '#06b6d4', '#a855f7', '#0ea5e9'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2 + 1;
    this.color = randomHex();
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + Math.floor(this.alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
  };

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();

  // Mouse interaction: attract nearby particles
  window.addEventListener('mousemove', (e) => {
    particles.forEach(p => {
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += dx * 0.02;
        p.y += dy * 0.02;
      }
    });
  });
})();

// ─────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = -100, my = -100, fx = -100, fy = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .btn, .project-card, .contact-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
  });
})();

// ─────────────────────────────────────
// TYPED TEXT EFFECT
// ─────────────────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'intelligent solutions.',
    'machine learning models.',
    'beautiful web apps.',
    'fast C++ programs.',
    'the future of tech.',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 1200);
})();

// ─────────────────────────────────────
// NAVBAR SCROLL & ACTIVE LINK
// ─────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.querySelectorAll('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveLink();
  });

  toggle.addEventListener('click', () => {
    links.forEach(l => l.classList.toggle('open'));
  });

  document.querySelectorAll('.nav-link, .btn[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('open'));
    });
  });

  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  updateActiveLink();
})();

// ─────────────────────────────────────
// SCROLL INDICATOR CLICK
// ─────────────────────────────────────
document.getElementById('scroll-indicator').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ─────────────────────────────────────
// SCROLL REVEAL ANIMATIONS
// ─────────────────────────────────────
(function initScrollReveal() {
  // Add reveal classes to elements
  const revealSelectors = [
    { sel: '.about-text',    cls: 'reveal-left' },
    { sel: '.about-details', cls: 'reveal-right' },
    { sel: '.skill-item',    cls: 'reveal' },
    { sel: '.project-card',  cls: 'reveal' },
    { sel: '.timeline-item', cls: 'reveal' },
    { sel: '.contact-card',  cls: 'reveal' },
    { sel: '.stat-card',     cls: 'reveal' },
    { sel: '.timeline-category', cls: 'reveal' },
  ];

  revealSelectors.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      const delay = Math.min(i * 0.1, 0.5);
      el.style.transitionDelay = delay + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
})();

// ─────────────────────────────────────
// SKILL BAR ANIMATION
// ─────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        entry.target.style.width = target + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

// ─────────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.count;
        let current = 0;
        const step = target / 40;
        const id = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(id); }
          entry.target.textContent = Math.ceil(current) + '+';
        }, 35);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ─────────────────────────────────────
// GLITCH / SPARKLE on hero name hover
// ─────────────────────────────────────
(function initGlitch() {
  const names = document.querySelectorAll('.hero-name');
  names.forEach(name => {
    name.addEventListener('mouseover', () => {
      name.style.filter = 'drop-shadow(0 0 20px rgba(124,58,237,0.8))';
    });
    name.addEventListener('mouseout', () => {
      name.style.filter = 'none';
    });
  });
})();

// ─────────────────────────────────────
// TILT EFFECT on cards
// ─────────────────────────────────────
(function initTilt() {
  const tiltables = document.querySelectorAll('.project-card, .contact-card');
  tiltables.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─────────────────────────────────────
// PAGE LOAD: fade in body
// ─────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
