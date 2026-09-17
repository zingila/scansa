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
