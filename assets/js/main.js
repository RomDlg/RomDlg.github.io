/* Romain Delage · portfolio. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  // ---------------------------------------------------------------- Config
  const EMAIL = 'contact@romaindelage.fr';

  // Prices (€ HT) and base duration in weeks. Keep in sync with the "dès …" labels in index.html.
  const SERVICES = { site: { n: 'Site web', base: 1500, d: 4 }, app: { n: 'Application mobile', base: 5000, d: 11 }, ref: { n: 'Refonte', base: 1800, d: 5 }, sec: { n: 'Cybersécurité', base: 900, d: 2 } };
  const SPEEDS = [{ n: 'Standard', x: 'prix de base', f: 1, w: 1 }, { n: 'Rapide', x: '+15 %', f: 1.15, w: 0.75 }, { n: 'Express', x: '+30 %', f: 1.3, w: 0.55 }];

  // ---------------------------------------------------------------- Helpers
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const raf = requestAnimationFrame;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const fmt = n => Math.round(n).toLocaleString('fr-FR');
  const qReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const qFine = matchMedia('(hover: hover) and (pointer: fine)');
  const motion = () => !qReduce.matches;
  const OUT = 'cubic-bezier(.2,.8,.2,1)';
  const root = document.documentElement;

  // ---------------------------------------------------------------- Header: progress, active section, method line
  const header = $('#hd'), bar = $('.hd-bar'), navLinks = $$('.nav > a'), methFill = $('.meth-fill'), meth = $('#methode');
  const navSecs = navLinks.map(a => $(a.hash));
  let geo = null, activeIdx = -2, ticking = false;

  const measure = () => {
    const y = scrollY, vh = innerHeight;
    header.style.setProperty('--hd-h', `${header.offsetHeight}px`);
    geo = {
      vh, max: Math.max(1, root.scrollHeight - vh),
      tops: navSecs.map(s => s.getBoundingClientRect().top + y),
      mTop: meth.getBoundingClientRect().top + y, mH: meth.offsetHeight
    };
  };
  const update = () => {
    ticking = false;
    if (!geo) measure();
    const y = scrollY, g = geo;
    bar.style.transform = `scaleX(${clamp01(y / g.max)})`;
    let act = -1;
    g.tops.forEach((t, i) => { if (t - y < g.vh * 0.4) act = i; });
    if (act !== activeIdx) {
      activeIdx = act;
      navLinks.forEach((a, i) => { a.classList.toggle('is-active', i === act); i === act ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    }
    methFill.style.transform = `scaleX(${clamp01((g.vh * 0.75 - (g.mTop - y)) / (g.mH * 0.7))})`;
  };
  const schedule = () => { if (!ticking) { ticking = true; raf(update); } };
  addEventListener('scroll', schedule, { passive: true });
  const remeasure = () => { measure(); schedule(); };
  addEventListener('resize', remeasure, { passive: true });
  new ResizeObserver(remeasure).observe(document.body);

  // ---------------------------------------------------------------- Mobile menu
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    header.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width: 921px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });

  // ---------------------------------------------------------------- Magnetic buttons & tilt (mouse only)
  $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (!qFine.matches || !motion()) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  const shot = $('[data-tilt]');
  shot.addEventListener('pointermove', e => {
    if (!qFine.matches || !motion()) return;
    const r = shot.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    shot.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.015)`;
  });
  shot.addEventListener('pointerleave', () => { shot.style.transform = ''; });

  // ---------------------------------------------------------------- Pricing configurator
  const cfg = { site: true, app: false, ref: false, sec: false };
  let speed = 0;
  const qNo = 'RD-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
  $$('[data-qno]').forEach(el => { el.textContent = qNo; });
  $('[data-qdate]').textContent = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  const calc = () => {
    const sp = SPEEDS[speed], lines = [], ws = [];
    let one = 0;
    for (const [id, s] of Object.entries(SERVICES)) {
      if (!cfg[id]) continue;
      one += s.base; ws.push(s.d);
      lines.push({ id, label: s.n, price: fmt(s.base) + ' €' });
    }
    if (one && sp.f > 1) lines.push({ id: 'speed' + speed, label: `Délai ${sp.n.toLowerCase()} ${sp.x}`, price: '+' + fmt(one * (sp.f - 1)) + ' €', acc: true });
    const mx = ws.length ? Math.max(...ws) : 0;
    const wk = ws.length ? Math.max(1, Math.round((mx + 0.4 * (ws.reduce((a, b) => a + b, 0) - mx)) * sp.w)) : 0;
    return { lines, total: Math.round(one * sp.f), wk };
  };

  const linesEl = $('[data-lines]'), totalEl = $('[data-total]'), sendEl = $('[data-send]'), tkLive = $('[data-tk-live]');
  let seen = null, shown = 0, target = null, countRaf = 0, liveT = 0;

  const renderQuote = () => {
    const C = calc();
    const now = new Set();
    const nodes = C.lines.map(l => {
      const row = document.createElement('div');
      row.className = 'tk-line' + (l.acc ? ' acc' : '');
      const a = document.createElement('span'), b = document.createElement('span');
      a.textContent = l.label; b.textContent = l.price; row.append(a, ' ', b);
      const key = l.id + '|' + l.label + l.price; now.add(key);
      row._new = seen && !seen.has(key);
      return row;
    });
    if (!nodes.length) {
      const e = document.createElement('span'); e.className = 'tk-empty'; e.textContent = 'Activez une prestation pour commencer.'; nodes.push(e);
    }
    linesEl.replaceChildren(...nodes);
    if (motion()) nodes.forEach(n => n._new && n.animate(
      [{ opacity: 0, clipPath: 'inset(0 100% 0 0)', transform: 'translateX(-6px)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'none' }],
      { duration: 520, delay: 40, easing: OUT, fill: 'backwards' }));
    seen = now;

    const weeks = C.wk ? `≈ ${C.wk} semaine${C.wk > 1 ? 's' : ''}` : '—';
    $$('[data-weeks]').forEach(el => { el.textContent = weeks; });

    // Animated total
    const t = C.total;
    if (target === null) { totalEl.textContent = fmt(t); shown = target = t; }
    else if (t !== target) {
      target = t; const from = shown, t0 = performance.now();
      cancelAnimationFrame(countRaf);
      if (!motion()) { shown = t; totalEl.textContent = fmt(t); }
      else {
        totalEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
        const step = now => {
          const k = Math.min(1, (now - t0) / 500);
          shown = from + (t - from) * (1 - Math.pow(1 - k, 3));
          totalEl.textContent = fmt(shown);
          if (k < 1) countRaf = raf(step); else shown = t;
        };
        countRaf = raf(step);
      }
      clearTimeout(liveT);
      liveT = setTimeout(() => { tkLive.textContent = `Total indicatif : ${fmt(t)} € HT${C.wk ? ', délai ' + weeks : ''}.`; }, 600);
    }

    const body = 'Bonjour Romain,\n\nVoici ma sélection :\n' + C.lines.map(l => `- ${l.label} : ${l.price}`).join('\n')
      + `\n\nTotal indicatif : ${fmt(C.total)} € HT` + (C.wk ? `\nDélai indicatif : ${C.wk} semaine${C.wk > 1 ? 's' : ''}` : '')
      + '\n\nMon projet en quelques mots :\n';
    sendEl.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Demande de devis ' + qNo)}&body=${encodeURIComponent(body)}`;
  };

  $$('[data-svc]').forEach(row => {
    const id = row.dataset.svc, btn = $('.svc-btn', row);
    btn.addEventListener('click', () => {
      cfg[id] = !cfg[id];
      row.classList.toggle('is-on', cfg[id]);
      btn.setAttribute('aria-pressed', cfg[id]);
      renderQuote();
    });
  });

  const seg = $('.seg'), segBtns = $$('button', seg);
  const setSpeed = i => {
    speed = i; seg.style.setProperty('--i', i);
    segBtns.forEach((b, k) => { b.setAttribute('aria-checked', k === i); b.tabIndex = k === i ? 0 : -1; });
    renderQuote();
  };
  segBtns.forEach((b, i) => {
    b.addEventListener('click', () => setSpeed(i));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
      e.preventDefault(); const n = (i + d + segBtns.length) % segBtns.length; segBtns[n].focus(); setSpeed(n);
    });
  });
  renderQuote();

  sendEl.addEventListener('click', () => {
    const t = $('.tk'); if (!motion()) return;
    t.animate([{ transform: 'rotate(-1.2deg)' }, { transform: 'translateY(-14px) rotate(-3deg)', offset: 0.3 }, { transform: 'translateY(60px) rotate(4deg)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.6,0,.4,1)' })
      .onfinish = () => t.animate([{ transform: 'translateY(-40px) rotate(-4deg)', opacity: 0 }, { transform: 'rotate(-1.2deg)', opacity: 1 }], { duration: 800, delay: 300, easing: OUT, fill: 'backwards' });
  });

  // ---------------------------------------------------------------- Copy email
  const copyBtn = $('[data-copy]'), rip = $('.copy-rip', copyBtn), burst = $('.burst', copyBtn), copyLive = $('[data-copy-live]');
  let copyT = 0;
  const writeClip = txt => (navigator.clipboard?.writeText(txt) ?? Promise.reject()).catch(() => {
    const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0';
    document.body.append(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove();
  });
  copyBtn.addEventListener('click', e => {
    writeClip(copyBtn.dataset.copy);
    copyLive.textContent = 'Adresse email copiée.';
    if (motion()) {
      const r = copyBtn.getBoundingClientRect(), d = Math.hypot(r.width, r.height) * 2;
      const cx = e.clientX || r.left + r.width / 2, cy = e.clientY || r.top + r.height / 2;
      const c = document.createElement('span');
      c.style.cssText = `position:absolute;left:${cx - r.left - d / 2}px;top:${cy - r.top - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:rgba(255,255,255,.28)`;
      rip.append(c);
      c.animate([{ transform: 'scale(0)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 900, easing: OUT }).onfinish = () => c.remove();
      copyBtn.animate([{ scale: 1 }, { scale: 0.95 }, { scale: 1.03 }, { scale: 1 }], { duration: 550, easing: 'cubic-bezier(.3,1.4,.5,1)' });
      for (let k = 0; k < 10; k++) {
        const p = document.createElement('span'), a = (k / 10) * Math.PI * 2 + Math.random() * 0.4, dist = 34 + Math.random() * 22, sz = 4 + Math.random() * 3;
        p.style.cssText = `position:absolute;left:${-sz / 2}px;top:${-sz / 2}px;width:${sz}px;height:${sz}px;border-radius:${k % 2 ? '50%' : '1px'};background:#fff`;
        burst.append(p);
        p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * dist}px,${Math.sin(a) * dist}px) scale(0)`, opacity: 0 }],
          { duration: 700 + Math.random() * 250, delay: 120, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'backwards' }).onfinish = () => p.remove();
      }
    }
    copyBtn.classList.add('is-copied'); clearTimeout(copyT);
    copyT = setTimeout(() => { copyBtn.classList.remove('is-copied'); copyLive.textContent = ''; }, 2400);
  });

  // ---------------------------------------------------------------- Scroll reveal
  // Only elements that start below the fold are hidden, so nothing visible ever flickers.
  if (motion() && 'IntersectionObserver' in window) {
    const vh = innerHeight, targets = [], jobs = [];
    $$('main > section:not(#top)').forEach(s => [...s.children].forEach((el, i) => { jobs.push([el, i * 0.08, '1.75rem']); targets.push(el); }));
    $$('[data-stagger]').forEach(g => { g._group = [...g.children]; g._group.forEach((el, i) => jobs.push([el, 0.12 + i * 0.07, '1.375rem'])); targets.push(g); });
    // Read every position first, then write, so layout is computed only once.
    jobs.map(j => j[0].getBoundingClientRect().top >= vh).forEach((below, k) => {
      if (!below) return;
      const [el, d, y] = jobs[k];
      el.classList.add('rv'); el.style.setProperty('--rv-d', d + 's'); el.style.setProperty('--rv-y', y);
    });
    const done = el => {
      if (!el.classList.contains('rv')) return;
      el.classList.add('in');
      const d = parseFloat(el.style.getPropertyValue('--rv-d')) || 0;
      setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--rv-d'); el.style.removeProperty('--rv-y'); }, 1000 + d * 1000);
    };
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; io.unobserve(el); done(el); el._group?.forEach(done);
    }), { rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
  }
})();