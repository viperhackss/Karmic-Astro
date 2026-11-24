// A fixed canvas of stars behind the whole page. Three depth layers drift at
// different speeds as you scroll (parallax), stars twinkle, and now and then a
// shooting star crosses the sky. Static when reduced motion is requested.
export function initStarfield({ reduced = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let dpr = 1;
  let stars = [];
  const shooting = [];
  let nextShot = 3;
  let px = 0;
  let py = 0;

  const COLORS = ['#ffffff', '#f6e7c8', '#c9c0f7', '#ffd98a'];

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(320, (w * h) / 5200));
    stars = Array.from({ length: count }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.35 + depth * 1.25,
        depth,
        tw: 0.6 + Math.random() * 2.4,
        ph: Math.random() * Math.PI * 2,
        c: COLORS[Math.random() < 0.7 ? 0 : 1 + Math.floor(Math.random() * 3)],
        cross: depth > 0.93,
      };
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const scroll = window.scrollY;
    for (const s of stars) {
      const speed = 0.04 + s.depth * 0.22;
      let y = (s.y - scroll * speed + py * s.depth * 8) % h;
      if (y < 0) y += h;
      let x = (s.x + px * s.depth * 10) % w;
      if (x < 0) x += w;
      const a = reduced ? 0.7 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
      ctx.globalAlpha = a * (0.35 + s.depth * 0.65);
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.cross) {
        ctx.globalAlpha *= 0.55;
        ctx.fillRect(x - s.r * 4, y - 0.4, s.r * 8, 0.8);
        ctx.fillRect(x - 0.4, y - s.r * 4, 0.8, s.r * 8);
      }
    }
    for (let i = shooting.length - 1; i >= 0; i--) {
      const m = shooting[i];
      m.life += 1 / 60;
      const p = m.life / m.dur;
      if (p >= 1) {
        shooting.splice(i, 1);
        continue;
      }
      const x = m.x + m.vx * m.life;
      const y = m.y + m.vy * m.life;
      const g = ctx.createLinearGradient(x, y, x - m.vx * 0.18, y - m.vy * 0.18);
      g.addColorStop(0, 'rgba(255,240,200,0.95)');
      g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.globalAlpha = Math.sin(p * Math.PI);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - m.vx * 0.18, y - m.vy * 0.18);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function loop(ts) {
    const t = ts / 1000;
    if (!document.hidden) {
      if (t > nextShot) {
        const fromLeft = Math.random() < 0.5;
        shooting.push({
          x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
          y: Math.random() * h * 0.35,
          vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 260),
          vy: 180 + Math.random() * 140,
          life: 0,
          dur: 0.9 + Math.random() * 0.5,
        });
        nextShot = t + 4 + Math.random() * 6;
      }
      draw(t);
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  if (reduced) {
    draw(0);
    window.addEventListener('scroll', () => draw(0), { passive: true });
    window.addEventListener('resize', () => draw(0));
  } else {
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / w - 0.5) * 2;
      py = (e.clientY / h - 0.5) * 2;
    }, { passive: true });
    requestAnimationFrame(loop);
  }
}
