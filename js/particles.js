/* ============================================
   Particle Background Animation
   Optimized with reduced-motion support and
   spatial grid for O(n) connection checking.
   ============================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Skip animation if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let w, h;
  let animationId = null;
  let isVisible = true;

  const PARTICLE_COUNT = 50;
  const CONNECTION_DIST = 120;
  const GRID_SIZE = CONNECTION_DIST;
  const particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,' + this.alpha + ')';
      ctx.fill();
    }
  }

  // Spatial grid for efficient neighbor lookup
  function buildGrid() {
    const grid = {};
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const gx = Math.floor(p.x / GRID_SIZE);
      const gy = Math.floor(p.y / GRID_SIZE);
      const key = gx + ',' + gy;
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

      // Check neighboring cells
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
                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = 'rgba(6,182,212,' + (0.08 * (1 - dist / CONNECTION_DIST)) + ')';
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

    const grid = buildGrid();
    drawConnections(grid);

    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  window.addEventListener('resize', resize);

  // IntersectionObserver to pause when not visible
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!isVisible) {
          isVisible = true;
          animate();
        }
      } else {
        isVisible = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas);

  // Pause on reduced motion change
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

  // Start animation
  animate();
})();
