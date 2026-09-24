/* The journey (six steps, one phone) and the hero dust. Plain JS, no libraries. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero dust: gold points that drift, join into constellations and part around the cursor ---------- */
  const hero = document.querySelector('.hero');
  const dust = document.getElementById('dust');
  if (hero && dust) {
    const ctx = dust.getContext('2d');
    let W = 0, H = 0, pts = [], mx = -9999, my = -9999, raf = 0, visible = true;
    const size = () => {
      const r = hero.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; dust.width = W * d; dust.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(130, (W * H) / 11000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: .6 + Math.random() * 1.6 }));
    };
    const step = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) { const f = (1 - Math.sqrt(d2) / 140) * .9; p.vx += (dx / Math.sqrt(d2 + .01)) * f; p.vy += (dy / Math.sqrt(d2 + .01)) * f; }
        p.vx *= .94; p.vy *= .94; p.vx += (Math.random() - .5) * .02; p.vy += (Math.random() - .5) * .02;
        p.x += p.vx + .05; p.y += p.vy - .03;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) { ctx.globalAlpha = (1 - d / 120) * .35; ctx.strokeStyle = '#D8B67C'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const p of pts) { ctx.globalAlpha = .85; ctx.fillStyle = '#F0DBAE'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      if (visible && !reduce) raf = requestAnimationFrame(step);
    };
    hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mx = my = -9999; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) step(); }).observe(hero);
    addEventListener('resize', size);
    size(); step();
  }

  /* ---------- the journey ---------- */
  const track = document.querySelector('.jr-track');
  if (!track) return;
  const steps = [...document.querySelectorAll('.jr-step')];
  const screens = [...document.querySelectorAll('.scr')];
  const rail = [...document.querySelectorAll('.jr-rail i')];
  const big = document.querySelector('.jr-bignum');
  const phone = document.querySelector('.jr-phone');
  const canvas = document.querySelector('.jr-dust');
  const ctx = canvas.getContext('2d');
  let current = -1, sparks = [];

  // drawings inside the phone come from art.js, like everywhere else on the page
  document.querySelectorAll('[data-jr-art]').forEach((el) => { el.innerHTML = window.ART(el.dataset.jrArt); });

  // step 1 types her birth details into the fields, letter by letter
  let typing = 0;
  const typeFields = () => {
    const my = ++typing;
    const fields = [...document.querySelectorAll('.scr-birth .fld')];
    const btn = document.querySelector('.scr-birth .goldbtn');
    fields.forEach((f) => { f.querySelector('span').textContent = ''; f.classList.remove('typing'); });
    btn.classList.remove('ready');
    let i = 0;
    const next = () => {
      if (my !== typing) return;
      if (i >= fields.length) { btn.classList.add('ready'); return; }
      const f = fields[i], text = f.dataset.v, span = f.querySelector('span');
      f.classList.add('typing');
      let k = 0;
      const tick = () => {
        if (my !== typing) return;
        span.textContent = text.slice(0, ++k);
        if (k < text.length) setTimeout(tick, reduce ? 0 : 55);
        else { f.classList.remove('typing'); i++; setTimeout(next, 180); }
      };
      tick();
    };
    next();
  };

  // on every step change a small burst of gold dust flies from the text into the phone
  const burst = () => {
    if (reduce) return;
    const r = canvas.getBoundingClientRect(), pr = phone.getBoundingClientRect(), tr = steps[0].parentElement.getBoundingClientRect();
    const tx = pr.left - r.left + pr.width / 2, ty = pr.top - r.top + pr.height * .45;
    for (let i = 0; i < 46; i++) {
      const sx = tr.left - r.left + Math.random() * tr.width, sy = tr.top - r.top + Math.random() * tr.height;
      sparks.push({ x: sx, y: sy, tx: tx + (Math.random() - .5) * 120, ty: ty + (Math.random() - .5) * 220, t: 0, d: 50 + Math.random() * 40, r: .6 + Math.random() * 1.8 });
    }
  };
  const drawSparks = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== canvas.clientWidth * d) { canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    sparks = sparks.filter((s) => s.t < s.d);
    for (const s of sparks) {
      s.t++;
      const k = s.t / s.d, e = 1 - Math.pow(1 - k, 3);
      const x = s.x + (s.tx - s.x) * e, y = s.y + (s.ty - s.y) * e - Math.sin(k * Math.PI) * 60;
      ctx.globalAlpha = Math.sin(k * Math.PI) * .9; ctx.fillStyle = '#F0DBAE';
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawSparks);
  };
  drawSparks();

  const show = (i) => {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    screens.forEach((s, k) => s.classList.toggle('on', k === i));
    rail.forEach((s, k) => s.classList.toggle('on', k <= i));
    if (big) big.textContent = String(i + 1).padStart(2, '0');
    // rows and tiles arrive one after another
    screens[i].querySelectorAll('.row3, .glance div, .keys div').forEach((el, k) => { el.style.transitionDelay = `${120 + k * 90}ms`; });
    if (i === 0) typeFields();
    burst();
  };

  // the phone always fits the window, whatever its height (desktop header included)
  const fit = () => {
    const narrow = innerWidth <= 900;
    const room = narrow ? innerHeight - 64 - 230 : innerHeight - 64 - 40;
    const s = Math.min(1, room / phone.offsetHeight);
    phone.style.setProperty('--s', s.toFixed(3));
    phone.style.marginTop = narrow ? `${(s - 1) * phone.offsetHeight / 2}px` : '';
    phone.style.marginBottom = narrow ? `${(s - 1) * phone.offsetHeight / 2}px` : '';
  };
  addEventListener('resize', fit); fit();

  const onScroll = () => {
    const r = track.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    show(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    // the phone leans a little as the page moves
    const tilt = Math.sin(p * Math.PI * steps.length) * 6;
    phone.style.setProperty('--ty', (-tilt).toFixed(2));
    phone.style.setProperty('--tx', (tilt * .4).toFixed(2));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
