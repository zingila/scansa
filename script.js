/* ===================== HERO : l'envol des contrats =====================
   Repris du modèle officiel. Les feuilles arrivent des bords en désordre
   (contrats bruts, clauses rouges), flottent en nuage, puis traversent une à
   une le faisceau rouge : elles deviennent des feuilles « nettoyées » (coches
   vertes) et se rangent en pile dans le cadre. Le texte apparaît ensuite. */
(function () {
  const cv = document.getElementById('sky'), hero = document.querySelector('.hero'), stage = document.getElementById('stage');
  if (!cv || !hero || !stage) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, DPR = 1, mobile = false, beam, pile, cloud, band, SW = 130, SH = 180;
  const PAD = 26;
  const sheets = [], flashes = [];
  let Z = 0, T0 = 0, beamFlash = 0, ambientNext = 4200, heroIn = false, visible = true, started = false;
  let mx = 0, my = 0, pmx = 0, pmy = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ease = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3);
  const easeIO = t => t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  /* sprites : feuilles brutes (avec clauses rouges) et feuilles nettoyées */
  function sprite(kind, seed) {
    const c = document.createElement('canvas');
    c.width = (SW + PAD * 2) * DPR; c.height = (SH + PAD * 2) * DPR;
    const g = c.getContext('2d'); g.scale(DPR, DPR); g.translate(PAD, PAD);
    let s = seed * 9301 + 49297; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 22; g.shadowOffsetY = 10; g.fillStyle = '#FFFFFF'; rr(g, 0, 0, SW, SH, 3); g.fill(); g.restore();
    g.fillStyle = '#FFFFFF'; rr(g, 0, 0, SW, SH, 3); g.fill();
    const m = 13;
    g.fillStyle = '#26222B'; rr(g, m, 15, SW * (0.42 + r() * .18), 5.5, 1.5); g.fill();
    g.fillStyle = '#BD2C2D'; rr(g, m, 25, 24, 2.5, 1); g.fill();
    if (kind === 'raw') {
      let y = 40; const reds = new Set();
      while (reds.size < 2 + Math.floor(r() * 2)) reds.add(4 + Math.floor(r() * 13));
      for (let i = 0; i < 18 && y < SH - 26; i++) {
        const w = (SW - 2 * m) * (i % 6 === 5 ? 0.35 + r() * .3 : 0.72 + r() * .28);
        if (reds.has(i)) {
          g.fillStyle = 'rgba(226,35,59,.16)'; rr(g, m - 3, y - 2.5, w + 6, 7.5, 2); g.fill();
          g.fillStyle = '#E2233B'; rr(g, m, y, w, 2.6, 1); g.fill();
          rr(g, 3, y - 2, 2.5, 7, 1); g.fill();
        } else { g.fillStyle = '#BDB6BC'; rr(g, m, y, w, 2.6, 1); g.fill(); }
        y += i % 6 === 5 ? 12 : 8.2;
      }
      g.fillStyle = '#BDB6BC'; rr(g, m, SH - 18, 40, 2, 1); g.fill(); rr(g, SW - m - 40, SH - 18, 40, 2, 1); g.fill();
    } else {
      let y = 42;
      for (let i = 0; i < 6; i++) {
        g.fillStyle = '#1FA463'; g.beginPath(); g.arc(m + 4, y + 1.5, 3.4, 0, 7); g.fill();
        g.strokeStyle = '#fff'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(m + 2.2, y + 1.6); g.lineTo(m + 3.6, y + 3); g.lineTo(m + 6, y); g.stroke();
        g.fillStyle = '#C9C3C8'; rr(g, m + 13, y, (SW - 2 * m - 13) * (0.5 + r() * .35), 3, 1.5); g.fill(); y += 15;
      }
      g.fillStyle = 'rgba(31,164,99,.14)'; rr(g, m, SH - 34, SW - 2 * m, 20, 5); g.fill();
      g.fillStyle = '#1FA463'; rr(g, m + 8, SH - 26, 46, 4, 2); g.fill();
      g.fillStyle = '#26222B'; rr(g, m + 62, SH - 26, SW - 2 * m - 70, 4, 2); g.fill();
    }
    return c;
  }
  let RAW = [], CLEAN = [];
  function buildSprites() {
    RAW = []; CLEAN = [];
    for (let i = 0; i < 7; i++) RAW.push(sprite('raw', i + 1));
    for (let i = 0; i < 4; i++) CLEAN.push(sprite('clean', i + 11));
  }

  function layout() {
    const d = Math.min(2, window.devicePixelRatio || 1);
    const rebuild = d !== DPR || !RAW.length, prevSW = SW;
    DPR = d;
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    mobile = W < 901; // même seuil que la grille CSS (une seule colonne sous 900 px)
    const sr = stage.getBoundingClientRect(), hr = hero.getBoundingClientRect();
    const sx = sr.left - hr.left, sy = sr.top - hr.top;
    if (!mobile) {
      SW = Math.max(100, Math.min(160, W * 0.11)); SH = Math.round(SW * 1.38);
      pile = { x: sx + sr.width * 0.5, y: sy + sr.height * 0.5 };
      beam = { v: true, p: sx + 4, a: H * 0.08, b: H * 0.92 };
      cloud = { x: W * 0.30, y: H * 0.46, rx: W * 0.28, ry: H * 0.34 };
      band = { top: 0, h: H };
      /* balayage gauche ↔ droite, comme la version précédente (24 % → 62 %),
         sans jamais entrer dans le cadre de la pile */
      beam.min = W * 0.24;
      beam.max = Math.min(W * 0.62, pile.x - (SW * 0.58 + 14) - 24);
    } else {
      /* Mobile : la scène tient dans la bande sous le texte, dans le même ordre
         qu'au bureau (nuage à gauche → faisceau vertical → pile à droite).
         La formule d'origine plaçait le faisceau sous le nuage : les feuilles
         changeaient d'état sans jamais le traverser. */
      SW = Math.max(62, Math.min(96, W * 0.19)); SH = Math.round(SW * 1.38);
      const cy = sy + sr.height * 0.36;
      pile = { x: sx + sr.width * 0.74, y: cy };
      beam = { v: true, p: sx + sr.width * 0.48, a: sy + 6, b: sy + sr.height - 6 };
      cloud = { x: sx + sr.width * 0.2, y: cy, rx: sr.width * 0.19, ry: sr.height * 0.26 };
      band = { top: sy, h: sr.height };
      beam.min = sx + sr.width * 0.30;
      beam.max = pile.x - (SW * 0.58 + 14) - 12;
    }
    if (rebuild || SW !== prevSW) buildSprites();
    for (const s of sheets) if (s.state === 'pile') { s.x = pile.x + s.jx; s.y = pile.y + s.jy; }
    placeOverlay();
  }
  function placeOverlay() {
    const sr = stage.getBoundingClientRect(), hr = hero.getBoundingClientRect();
    const lx = pile.x - (sr.left - hr.left), ly = pile.y - (sr.top - hr.top);
    const hw = SW * 0.58 + 14, hh = SH * 0.58 + 14;
    const set = (id, l, t) => { const e = document.getElementById(id); e.style.left = l + 'px'; e.style.top = t + 'px'; };
    set('c1', lx - hw, ly - hh); set('c2', lx + hw - 22, ly - hh); set('c3', lx - hw, ly + hh - 22); set('c4', lx + hw - 22, ly + hh - 22);
    const card = document.getElementById('pileCard');
    let cx = lx;
    if (mobile) { /* la carte ne doit pas sortir de l'écran */
      const half = card.offsetWidth / 2 + 4;
      cx = Math.min(Math.max(cx, half), sr.width - half);
    }
    card.style.setProperty('--px', cx + 'px'); card.style.setProperty('--py', (ly + hh + 6) + 'px');
  }
  function edgePoint(side) {
    const m = Math.max(SW, SH) * 1.2;
    if (side === undefined) side = mobile ? [0, 0, 3, 1][Math.floor(Math.random() * 4)] : Math.floor(Math.random() * 4);
    if (side === 0) return { x: -m, y: rnd(0, H) };
    if (side === 1) return { x: rnd(0, W), y: -m };
    if (side === 2) return { x: W + m, y: rnd(0, H) };
    return { x: rnd(0, W), y: H + m };
  }
  function mk() { return { x: 0, y: 0, r: 0, s: 1, kind: 'raw', v: Math.floor(Math.random() * 7), state: 'fly', t0: 0, dur: 1, from: null, to: null, ctrl: null, crossed: false, jx: 0, jy: 0, jr: 0, ph: Math.random() * 7, z: ++Z, cx: 0, cy: 0, cr: 0, cs: 1 }; }
  function cloudPos() { const a = rnd(0, Math.PI * 2), d = Math.sqrt(Math.random()); return { x: cloud.x + Math.cos(a) * cloud.rx * d, y: cloud.y + Math.sin(a) * cloud.ry * d, r: rnd(-.6, .6), s: rnd(.45, .95) }; }
  function launch(s, t) { /* vol depuis un bord vers le nuage */
    const e = edgePoint(), c = cloudPos();
    s.from = { x: e.x, y: e.y, r: rnd(-2.5, 2.5), s: .35 }; s.to = c;
    s.ctrl = { x: (e.x + c.x) / 2 + rnd(-W * .25, W * .25), y: (e.y + c.y) / 2 + rnd(-H * .25, H * .25) };
    s.t0 = t; s.dur = rnd(850, 1250); s.state = 'fly'; s.cx = c.x; s.cy = c.y; s.cr = c.r; s.cs = c.s;
  }
  function scan(s, t) { /* du nuage vers la pile, en traversant le faisceau */
    s.from = { x: s.x, y: s.y, r: s.r, s: s.s };
    s.jx = rnd(-5, 5); s.jy = rnd(-4, 4); s.jr = rnd(-.06, .06);
    s.to = { x: pile.x + s.jx, y: pile.y + s.jy, r: s.jr, s: 1 };
    s.ctrl = beam.v ? { x: beam.p + rnd(-40, 20), y: (s.y + s.to.y) / 2 + rnd(-band.h * .12, band.h * .12) }
                    : { x: (s.x + s.to.x) / 2 + rnd(-W * .15, W * .15), y: beam.p + rnd(-20, 50) };
    s.t0 = t; s.dur = rnd(950, 1300); s.state = 'scan'; s.crossed = false; s.side = undefined; s.z = ++Z;
  }
  function bez(a, c, b, t) { const u = 1 - t; return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }; }
  function seed() {
    sheets.length = 0; const N = mobile ? 26 : 56;
    for (let i = 0; i < N; i++) { const s = mk(); launch(s, i * 24); sheets.push(s); }
    /* ordre de scan : les plus proches du faisceau partent en premier */
    const sorted = [...sheets].sort((a, b) => beam.v ? (b.cx - a.cx) : (a.cy - b.cy));
    sorted.forEach((s, i) => s.scanAt = 1450 + i * 34 + rnd(0, 90));
    ambientNext = 1450 + N * 34 + 1800;
  }
  function settleAll() { /* mouvement réduit : état final immédiat */
    sheets.length = 0; const N = mobile ? 24 : 40;
    for (let i = 0; i < N; i++) {
      const s = mk(); s.kind = 'clean'; s.v = Math.floor(Math.random() * 4);
      s.jx = rnd(-5, 5); s.jy = rnd(-4, 4); s.jr = rnd(-.06, .06);
      s.x = pile.x + s.jx; s.y = pile.y + s.jy; s.r = s.jr; s.s = 1; s.state = 'pile'; sheets.push(s);
    }
  }
  function showCopy() { if (!heroIn) { heroIn = true; hero.classList.add('in'); setTimeout(layout, 1200); } }

  function frame(now) { requestAnimationFrame(frame); if (!visible) return; if (!T0) T0 = now; tick(now - T0); }
  /* Position du faisceau : va-et-vient sur 9 s. Phase calée pour qu'il soit
     côté droit pendant la grande vague (1,4 s → 3,5 s) : toutes les feuilles
     du nuage le traversent vraiment avant d'atteindre la pile. */
  function beamAt(t) {
    const k = 0.5 + 0.5 * Math.cos((t - 2500) / 9000 * Math.PI * 2);
    return beam.min + (beam.max - beam.min) * k;
  }
  function clean(s) { s.crossed = true; s.kind = 'clean'; s.v = Math.floor(Math.random() * CLEAN.length); }

  function tick(t) {
    pmx += (mx - pmx) * .06; pmy += (my - pmy) * .06;
    beam.p = reduce ? beam.max : beamAt(t);
    if (!reduce) {
      for (const s of sheets) {
        if (s.state === 'fly') {
          if (t < s.t0) { s.x = s.from.x; s.y = s.from.y; s.s = 0; continue; }
          const k = ease((t - s.t0) / s.dur);
          const p = bez(s.from, s.ctrl, s.to, k); s.x = p.x; s.y = p.y;
          s.r = s.from.r + (s.to.r - s.from.r) * k; s.s = s.from.s + (s.to.s - s.from.s) * k;
          if (k >= 1) s.state = 'cloud';
        }
        if (s.state === 'cloud') {
          s.x = s.cx + Math.sin(t / 900 + s.ph) * 7; s.y = s.cy + Math.cos(t / 1150 + s.ph) * 9;
          s.r = s.cr + Math.sin(t / 1600 + s.ph) * .05; s.s = s.cs;
          if (s.scanAt !== undefined && t >= s.scanAt) scan(s, t);
        }
        if (s.state === 'scan') {
          const k = easeIO((t - s.t0) / s.dur);
          const p = bez(s.from, s.ctrl, s.to, k); s.x = p.x; s.y = p.y;
          s.r = s.from.r + (s.to.r - s.from.r) * k; s.s = s.from.s + (s.to.s - s.from.s) * k;
          /* le faisceau bouge : on détecte le moment où feuille et faisceau
             se croisent (changement de côté), quel que soit celui qui avance */
          const side = Math.sign(s.x - beam.p);
          if (s.side === undefined) s.side = side;
          if (!s.crossed && side !== s.side) {
            clean(s); beamFlash = 1;
            flashes.push({ x: beam.p, y: s.y, t0: t });
          }
          s.side = side;
          if (k >= 1) {
            if (!s.crossed) clean(s); // filet de sécurité : jamais de feuille brute dans la pile
            s.state = 'pile'; s.x = s.to.x; s.y = s.to.y; s.r = s.to.r; s.s = 1;
          }
        }
      }
      if (t > 2650) showCopy();
      /* ambiance : un contrat arrive, traverse, se range */
      if (t > ambientNext) {
        const s = mk(); const e = edgePoint(beam.v ? 0 : 3);
        s.x = e.x; s.y = e.y; s.r = rnd(-1.5, 1.5); s.s = .5;
        s.from = { x: e.x, y: e.y, r: s.r, s: .5 }; s.jx = rnd(-5, 5); s.jy = rnd(-4, 4); s.jr = rnd(-.06, .06);
        s.to = { x: pile.x + s.jx, y: pile.y + s.jy, r: s.jr, s: 1 };
        s.ctrl = beam.v ? { x: cloud.x + rnd(-W * .1, W * .1), y: band.top + rnd(band.h * .15, band.h * .85) } : { x: rnd(W * .2, W * .8), y: cloud.y };
        s.t0 = t; s.dur = rnd(2200, 3000); s.state = 'scan'; sheets.push(s);
        const piled = sheets.filter(q => q.state === 'pile');
        while (piled.length > 64) { const old = piled.shift(); sheets.splice(sheets.indexOf(old), 1); }
        ambientNext = t + rnd(2600, 4200);
      }
    }
    beamFlash *= .9;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);

    /* faisceau */
    const line = (a, b) => { ctx.beginPath(); if (beam.v) { ctx.moveTo(beam.p, a); ctx.lineTo(beam.p, b); } else { ctx.moveTo(a, beam.p); ctx.lineTo(b, beam.p); } ctx.stroke(); };
    const bt = reduce ? 1 : ease((t - 1350) / 600);
    if (bt > 0) {
      const len = (beam.b - beam.a) * bt, mid = (beam.a + beam.b) / 2, a = mid - len / 2, b = mid + len / 2, al = .55 + beamFlash * .45;
      const g = beam.v ? ctx.createLinearGradient(0, a, 0, b) : ctx.createLinearGradient(a, 0, b, 0);
      g.addColorStop(0, 'rgba(255,59,78,0)'); g.addColorStop(.15, `rgba(255,59,78,${al})`);
      g.addColorStop(.85, `rgba(255,59,78,${al})`); g.addColorStop(1, 'rgba(255,59,78,0)');
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(255,59,78,${.07 + beamFlash * .12})`; ctx.lineWidth = 22; line(a, b);
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; line(a, b);
      ctx.strokeStyle = `rgba(255,255,255,${.35 + beamFlash * .5})`; ctx.lineWidth = .6; line(a, b);
    }

    /* feuilles, triées par profondeur */
    const order = [...sheets].sort((p, q) => { const zp = p.state === 'pile' ? p.z : p.z + 1e6, zq = q.state === 'pile' ? q.z : q.z + 1e6; return zp - zq; });
    for (const s of order) {
      if (s.s <= 0.01) continue;
      const px = s.state === 'pile' ? pmx * .35 : pmx * (1.2 - s.s), py = s.state === 'pile' ? pmy * .35 : pmy * (1.2 - s.s);
      const img = s.kind === 'raw' ? RAW[s.v % RAW.length] : CLEAN[s.v % CLEAN.length];
      ctx.save(); ctx.translate(s.x + px, s.y + py); ctx.rotate(s.r); ctx.scale(s.s, s.s);
      ctx.drawImage(img, -(SW / 2 + PAD), -(SH / 2 + PAD), SW + PAD * 2, SH + PAD * 2); ctx.restore();
    }
    /* impacts sur le faisceau */
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i], k = (t - f.t0) / 420;
      if (k >= 1) { flashes.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(255,59,78,${(1 - k) * .7})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(f.x, f.y, 6 + k * 44, 0, 7); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${(1 - k) * .9})`; ctx.beginPath(); ctx.arc(f.x, f.y, 3 * (1 - k), 0, 7); ctx.fill();
    }
  }
  function init() {
    if (started) return; started = true;
    layout();
    if (reduce) { settleAll(); showCopy(); } else seed();
    requestAnimationFrame(frame);
  }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * 24; my = ((e.clientY - r.top) / r.height - .5) * 16; });
  hero.addEventListener('pointerleave', () => { mx = 0; my = 0; });
  new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(hero);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init); else init();
  setTimeout(init, 1500);
  /* secours : si l'animation ne démarre pas, le texte apparaît quand même */
  setTimeout(showCopy, 4500);
})();

(function () {
  const ARTICLES = [
    {
      n: 1, title: 'Objet', status: 'ok',
      text: 'Le bailleur donne en location un appartement de trois pièces d’une surface de 58 m² situé au 14 rue des Lilas, à usage exclusif d’habitation principale.',
      heading: 'Rien à signaler.',
      explain: 'La désignation du logement, sa surface et son usage sont ceux qu’exige un bail d’habitation. La surface habitable est bien mentionnée.',
      ref: 'Loi 89-462, art. 3'
    },
    {
      n: 2, title: 'Durée', status: 'ok',
      text: 'Le présent contrat est conclu pour une durée de trois ans à compter du 1er octobre 2026, renouvelable par tacite reconduction.',
      heading: 'Trois ans, c’est la durée légale.',
      explain: 'Quand le bailleur est un particulier, un bail vide dure au minimum trois ans et se renouvelle tacitement. Le contrat respecte cette règle.',
      ref: 'Loi 89-462, art. 10'
    },
    {
      n: 3, title: 'Loyer', status: 'ok',
      text: 'Le loyer mensuel est fixé à 1 180 € hors charges, payable d’avance le 1er de chaque mois. Il sera révisé chaque année selon l’indice de référence des loyers.',
      heading: 'Un loyer révisable une fois par an, c’est normal.',
      explain: 'La révision annuelle sur l’indice de référence des loyers est le mécanisme prévu par la loi. Le mode de paiement reste libre, ce qui est correct.',
      ref: 'Loi 89-462, art. 17-1'
    },
    {
      n: 4, title: 'Dépôt de garantie', status: 'bad',
      text: 'Le locataire verse à la signature un dépôt de garantie de 2 360 €, soit deux mois de loyer hors charges, restitué dans les trois mois suivant la remise des clés.',
      heading: 'Deux mois demandés, un seul est permis.',
      explain: 'Pour un logement loué vide, le dépôt de garantie ne peut pas dépasser un mois de loyer hors charges. Ici, cela fait 1 180 €, pas 2 360 €. Le surplus n’est pas dû.',
      ref: 'Loi 89-462, art. 22',
      reply: '« Le dépôt de garantie est plafonné à un mois de loyer hors charges par l’article 22 de la loi du 6 juillet 1989. Je verserai 1 180 €. »'
    },
    {
      n: 6, title: 'Assurance', status: 'bad',
      text: 'Le locataire souscrira une assurance multirisque habitation auprès de la compagnie désignée par le bailleur et en justifiera chaque année à sa demande.',
      heading: 'L’assurance est obligatoire.<br>L’assureur, vous le choisissez.',
      explain: 'Vous devez bien assurer le logement contre les risques locatifs. Mais une clause qui vous impose la compagnie choisie par le bailleur est réputée non écrite : elle n’a aucune valeur.',
      ref: 'Loi 89-462, art. 4 et 7 g',
      reply: '« Je vous remettrai une attestation d’assurance habitation, souscrite auprès de l’assureur de mon choix, comme le prévoit l’article 7 g de la loi du 6 juillet 1989. »'
    },
    {
      n: 8, title: 'Visites', status: 'bad',
      text: 'En cas de congé, le locataire laissera visiter les lieux tous les jours, dimanches et jours fériés compris, de 9 h à 19 h, en vue de la relocation.',
      heading: 'Deux heures par jour ouvrable,<br>pas dix heures tous les jours.',
      explain: 'La loi interdit toute clause qui vous oblige à laisser visiter le logement les jours fériés ou plus de deux heures par jour ouvrable. Vous fixez les créneaux avec le bailleur.',
      ref: 'Loi 89-462, art. 4 c',
      reply: '« Je laisserai visiter le logement dans la limite de deux heures les jours ouvrables, conformément à l’article 4 de la loi du 6 juillet 1989, aux créneaux que nous conviendrons. »'
    },
    {
      n: 11, title: 'Solidarité', status: 'warn',
      text: 'En cas de colocation, les colocataires restent solidaires du paiement des loyers et charges jusqu’à six mois après le départ de l’un d’eux.',
      heading: 'Vous restez tenu six mois après votre départ.',
      explain: 'En colocation, la solidarité entre colocataires est autorisée. Elle prend fin quand un nouveau colocataire vous remplace, et au plus tard six mois après la fin de votre préavis. Ce n’est pas abusif, mais cela engage votre budget.',
      ref: 'Loi 89-462, art. 8-1'
    },
    {
      n: 12, title: 'État des lieux', status: 'bad',
      text: 'L’état des lieux de sortie sera dressé par commissaire de justice, ses honoraires étant intégralement à la charge du locataire.',
      heading: 'Les honoraires ne peuvent pas être<br>mis entièrement à votre charge.',
      explain: 'Si l’état des lieux est établi par un commissaire de justice faute d’accord amiable, ses frais sont partagés par moitié. Une clause qui vous facture l’état des lieux est réputée non écrite.',
      ref: 'Loi 89-462, art. 3-2 et 4 i',
      reply: '« Un état des lieux amiable et gratuit peut être établi entre nous. À défaut, les frais du commissaire de justice sont partagés par moitié, selon l’article 3-2 de la loi du 6 juillet 1989. »'
    }
  ];

  const LABELS = {
    ok: { badge: 'Conforme', tag: 'Conforme' },
    bad: { badge: 'Non écrite', tag: 'Réputée non écrite' },
    warn: { badge: 'Vigilance', tag: 'Légal, à connaître' }
  };
  const FINAL_SCORE = 46;
  const RING_LEN = 2 * Math.PI * 34;

  /* ---------- Nav ---------- */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - 80);
  }

  /* ---------- Build contract ---------- */
  const list = document.getElementById('articles');
  ARTICLES.forEach((a, i) => {
    const li = document.createElement('li');
    li.className = 'article ' + a.status;
    li.tabIndex = 0;
    li.dataset.index = i;
    li.innerHTML =
      '<span class="num">Article ' + a.n + '</span>' +
      '<div><div class="head"><strong>' + a.title + '</strong><span class="badge">' + LABELS[a.status].badge + '</span></div>' +
      '<p><mark>' + a.text + '</mark></p></div>';
    list.appendChild(li);
  });
  const items = Array.from(list.children);

  /* ---------- Detail panel ---------- */
  const detail = document.getElementById('detail');
  let selected = -1;
  let userSelected = false;

  function renderDetail(i) {
    const a = ARTICLES[i];
    selected = i;
    items.forEach((el, k) => el.classList.toggle('active', k === i));
    detail.classList.add('fade');
    setTimeout(() => {
      detail.innerHTML =
        '<p class="eyebrow small">Article ' + a.n + ' · ' + a.title + '</p>' +
        '<span class="tag ' + a.status + '">' + LABELS[a.status].tag + '</span>' +
        '<h4>' + a.heading + '</h4>' +
        '<p class="detail-text">' + a.explain + '</p>' +
        '<p class="ref">' + a.ref + '</p>' +
        (a.reply ? '<div class="reply"><p class="eyebrow">Ce que vous pouvez répondre</p><p>' + a.reply + '</p></div>' : '');
      detail.classList.remove('fade');
    }, 180);
  }

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  items.forEach((el, i) => {
    const pick = () => {
      userSelected = true;
      renderDetail(i);
      // sur mobile l'explication est sous le contrat : on l'amène à l'écran
      if (isMobile()) setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    };
    el.addEventListener('click', pick);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });

  /* ---------- Scroll-driven scan ---------- */
  const contract = document.getElementById('contract');
  const scanline = document.getElementById('scanline');
  const ringFg = document.getElementById('ringFg');
  const scoreVal = document.getElementById('scoreVal');
  const scoreTitle = document.getElementById('scoreTitle');
  const scoreSub = document.getElementById('scoreSub');
  const cRed = document.getElementById('cRed');
  const cAmber = document.getElementById('cAmber');
  const cGreen = document.getElementById('cGreen');
  ringFg.style.strokeDasharray = RING_LEN;
  ringFg.style.strokeDashoffset = RING_LEN;

  let maxProgress = 0;
  let done = false;

  function updateScan() {
    const rect = contract.getBoundingClientRect();
    const trigger = window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));
    maxProgress = Math.max(maxProgress, p);

    const lineY = maxProgress * rect.height;
    scanline.style.top = lineY + 'px';
    contract.classList.toggle('scanning', p > 0 && maxProgress < 1);

    const counts = { ok: 0, bad: 0, warn: 0 };
    let scanned = 0;
    items.forEach((el, i) => {
      if (el.offsetTop + el.offsetHeight * 0.5 < lineY) {
        el.classList.add('scanned');
        counts[ARTICLES[i].status]++;
        scanned++;
      }
    });

    cRed.textContent = counts.bad;
    cAmber.textContent = counts.warn;
    cGreen.textContent = counts.ok;

    const score = Math.round(FINAL_SCORE * (scanned / items.length));
    scoreVal.textContent = score;
    ringFg.style.strokeDashoffset = RING_LEN * (1 - score / 100);

    if (scanned === items.length && !done) {
      done = true;
      contract.classList.remove('scanning');
      scoreTitle.textContent = 'À négocier avant de signer';
      scoreSub.textContent = 'Quatre clauses n’ont aucune valeur juridique.';
      if (!userSelected) renderDetail(3);
    }
  }

  /* ---------- Reveal ---------- */
  const revealTargets = document.querySelectorAll('.light h2, .light .lead, .step, .types li, .cta h2, .cta .hero-lead, .cta .stores');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateNav(); updateScan(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateNav();
  updateScan();
})();
