/* ============================================
   Particle Background — Multi-color + Mouse
   Optimized with reduced-motion support and
   spatial grid for O(n) connection checking.
   ============================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let w, h;
  let animationId = null;
  let isVisible = true;
  let mouseX = -1000, mouseY = -1000;

  const PARTICLE_COUNT = 45;
  const CONNECTION_DIST = 110;
  const GRID_SIZE = CONNECTION_DIST;
  const MOUSE_DIST = 100;
  const particles = [];

  const COLORS = [
    'rgba(6,182,212,',   // cyan
    'rgba(139,92,246,',  // purple
    'rgba(6,182,212,',   // cyan (weighted)
  ];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.colorIdx = Math.floor(Math.random() * COLORS.length);
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r = Math.random() * 1.2 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.08;
    }
    update() {
      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST && dist > 0) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.015;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Damping
      this.vx *= 0.998;
      this.vy *= 0.998;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -10) this.x = w + 10;
      else if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      else if (this.y > h + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[this.colorIdx] + this.alpha + ')';
      ctx.fill();
    }
  }

  function buildGrid() {
    const grid = {};
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const key = Math.floor(p.x / GRID_SIZE) + ',' + Math.floor(p.y / GRID_SIZE);
      if (!grid[key]) grid[key] = [];
      grid[key].push(i);
    }
    return grid;
  }

  function drawConnections(grid) {
    for (const key in grid) {
      const parts = key.split(',');
      const gx = parseInt(parts[0]);
      const gy = parseInt(parts[1]);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborKey = (gx + dx) + ',' + (gy + dy);
          if (!grid[neighborKey]) continue;

          const cellA = grid[key];
          const cellB = grid[neighborKey];

          for (let ai = 0; ai < cellA.length; ai++) {
            const startJ = (key === neighborKey) ? ai + 1 : 0;
            for (let bi = startJ; bi < cellB.length; bi++) {
              const pa = particles[cellA[ai]];
              const pb = particles[cellB[bi]];
              const ddx = pa.x - pb.x;
              const ddy = pa.y - pb.y;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dist < CONNECTION_DIST) {
                const alpha = 0.06 * (1 - dist / CONNECTION_DIST);
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = COLORS[pa.colorIdx] + alpha + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }
    }
  }

  function animate() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawConnections(buildGrid());
    animationId = requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  window.addEventListener('resize', resize);

  // Mouse tracking
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!isVisible) { isVisible = true; animate(); }
      } else {
        isVisible = false;
        if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas);

  prefersReducedMotion.addEventListener('change', function(e) {
    if (e.matches) {
      isVisible = false;
      if (animationId) cancelAnimationFrame(animationId);
      canvas.style.display = 'none';
    } else {
      canvas.style.display = '';
      isVisible = true;
      animate();
    }
  });

  animate();
})();
