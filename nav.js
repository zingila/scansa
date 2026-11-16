// Scansa · menu mobile (partagé par toutes les pages)
(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('menu');
  if (!nav || !toggle || !links) return;

  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
})();

// Scansa · mesure d'audience sans cookie : chaque page vue part dans le tableau de statistiques
// (Google Sheet, via une application Apps Script). Identifiant tiré au hasard, gardé 13 mois dans
// ce navigateur ; seul le chemin de la page est envoyé, jamais l'adresse complète.
// scansa.fr/?moi=1 marque nos propres visites (écartées des chiffres), ?moi=0 enlève la marque.
(function () {
  // reset-password.html reçoit les jetons du compte dans son adresse : aucune mesure et
  // aucun appel réseau depuis cette page (exigence du rebond « mot de passe oublié »).
  if (/\/reset-password(\.html)?$/.test(location.pathname)) return;
  const BALISE = 'https://script.google.com/macros/s/AKfycbx2CTvZokK9jXLR8ccCe_BsI8ZVlyaccjme99NYhHWNr2a76nimuZ14RoUfppiWPye97A/exec';
  let ls;
  try { ls = window.localStorage; ls.setItem('scansa_test', '1'); ls.removeItem('scansa_test'); } catch (e) { return; }
  const nav = navigator;

  const bouton = document.getElementById('mesure-refus');
  const etat = () => { if (bouton) bouton.textContent = ls.getItem('scansa_refus') ? 'Vous n’êtes plus compté. Être compté à nouveau' : 'Ne plus être compté sur ce navigateur'; };
  if (bouton) {
    etat();
    bouton.addEventListener('click', () => {
      if (ls.getItem('scansa_refus')) ls.removeItem('scansa_refus'); else ls.setItem('scansa_refus', '1');
      etat();
    });
  }

  if (ls.getItem('scansa_refus') || nav.globalPrivacyControl || nav.doNotTrack === '1') return;
  if (nav.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly/i.test(nav.userAgent || '')) return;

  const q = new URLSearchParams(location.search);
  if (q.get('moi') === '1') ls.setItem('scansa_moi', '1');
  if (q.get('moi') === '0') ls.removeItem('scansa_moi');

  const hasard = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const maintenant = Date.now();
  let neuf = false;
  let [vid, vdate] = (ls.getItem('scansa_v') || '').split('.');
  if (!vid || !(maintenant - Number(vdate) < 395 * 864e5)) { vid = hasard(); vdate = maintenant; neuf = true; ls.setItem('scansa_v', vid + '.' + vdate); }

  let visite = ls.getItem('scansa_s');
  const premiere = !visite || !(maintenant - Number(ls.getItem('scansa_t')) < 30 * 60e3);
  if (premiere) { visite = hasard(); ls.setItem('scansa_s', visite); }
  ls.setItem('scansa_t', String(maintenant));

  let ref = '';
  try { const h = new URL(document.referrer).hostname; if (!/(^|\.)scansa\.fr$/.test(h)) ref = h; } catch (e) {}

  const base = { p: location.pathname.slice(0, 200), id: vid, vi: visite, pv: hasard(), m: ls.getItem('scansa_moi') ? 1 : 0 };
  const envoie = (o) => {
    const corps = JSON.stringify(Object.assign({}, base, o));
    try { if (nav.sendBeacon && nav.sendBeacon(BALISE, new Blob([corps], { type: 'text/plain' }))) return; } catch (e) {}
    try { fetch(BALISE, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: corps }); } catch (e) {}
  };

  envoie({ t: 'vue', f: premiere ? 1 : 0, n: neuf ? 1 : 0, r: premiere ? ref : '',
    u: premiere ? (q.get('utm_source') || '').slice(0, 60) : '', w: window.innerWidth || 0, l: (nav.language || '').slice(0, 12) });

  // temps passé page visible et part de la page lue, envoyés quand on la quitte
  let actif = 0, depuis = document.visibilityState === 'visible' ? Date.now() : 0, lu = 0, dernier = 0;
  const mesure = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    lu = Math.max(lu, h > 0 ? Math.round(100 * window.scrollY / h) : 100);
  };
  mesure();
  window.addEventListener('scroll', mesure, { passive: true });
  const fin = () => {
    if (depuis) { actif += Date.now() - depuis; depuis = 0; }
    const s = Math.round(actif / 1000);
    if (s > dernier) { dernier = s; envoie({ t: 'fin', s, d: Math.min(lu, 100) }); }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') fin();
    else { depuis = Date.now(); ls.setItem('scansa_t', String(Date.now())); }
  });
  window.addEventListener('pagehide', fin);
})();
