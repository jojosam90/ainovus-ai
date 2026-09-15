(function(){
  'use strict';

  /* ── PRELOADER ── */
  const preloader = document.getElementById('preloader');
  function finishLoad(){
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
    }, 700);
  }
  if (document.readyState === 'complete') finishLoad();
  else window.addEventListener('load', finishLoad);
  setTimeout(() => { if (!document.body.classList.contains('loaded')) finishLoad(); }, 3500);

  /* ── MOBILE NAV ── */
  const mob = document.getElementById('mob');
  const ham = document.getElementById('ham');
  function toggleNav(){
    const open = mob.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-locked', open);
  }
  ham.addEventListener('click', toggleNav);
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  }));

  /* ── FAQ ── */
  document.querySelectorAll('.fq').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const ans = item.querySelector('.fa');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.fi').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.fa').style.maxHeight = '0';
        i.querySelector('.fq').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen){
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── FORM ── */
  const form = document.getElementById('contactForm');
  if (form){
    const CONTACT_EMAIL = 'general@ainovus.ai';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-btn');

      const fname = document.getElementById('fname').value.trim();
      const lname = document.getElementById('lname').value.trim();
      const email = document.getElementById('femail').value.trim();
      const phoneCode = document.getElementById('fphonecode').value;
      const phone = document.getElementById('fphone').value.trim();
      const topic = document.getElementById('ftopic').value;
      const message = document.getElementById('fmsg').value.trim();

      const subject = `Website enquiry — ${topic || 'General enquiry'}`;
      const body = [
        `Name: ${fname} ${lname}`,
        `Email: ${email}`,
        `Phone: ${phoneCode} ${phone}`,
        `Enquiry type: ${topic}`,
        '',
        'Message:',
        message
      ].join('\n');

      const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      btn.textContent = 'Opening your email app…';
      btn.disabled = true;

      window.location.href = mailtoLink;

      setTimeout(() => {
        btn.textContent = 'Submit';
        btn.disabled = false;
      }, 2500);
    });
  }

  /* ── SCROLL: nav + progress + to-top + spy + reveal ── */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const spyLinks = document.querySelectorAll('a.nav-a');
  const spySections = ['home','about','work','services','creators','faq','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const logSheet = document.getElementById('logSheet');

  function checkReveal(){
    document.querySelectorAll('.reveal:not(.in), .reveal-img:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) el.classList.add('in');
    });
    if (logSheet && !logSheet.classList.contains('log-done')){
      const r = logSheet.getBoundingClientRect();
      if (r.top < window.innerHeight - 80 && r.bottom > 0){
        logSheet.classList.add('log-done');
        logSheet.querySelectorAll('.log-row').forEach((row, i) => setTimeout(() => row.classList.add('in'), 140 * i));
      }
    }
  }

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      toTop.classList.toggle('show', y > 600);
      let current = 'home';
      for (const s of spySections){ if (y >= s.offsetTop - 160) current = s.id; }
      spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
      checkReveal();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', checkReveal);
  onScroll();
  checkReveal();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── COOKIE CONSENT ── */
  (function(){
    const KEY = 'ainovus_cookie_consent';
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');

    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}

    if (!stored) {
      setTimeout(() => banner.classList.add('show'), 900);
    }

    function setConsent(value){
      try { localStorage.setItem(KEY, value); } catch (e) {}
      banner.classList.remove('show');
    }

    if (acceptBtn) acceptBtn.addEventListener('click', () => setConsent('accepted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => setConsent('rejected'));
  })();

  /* ── WHATSAPP MENU ── */
  (function(){
    const toggle = document.getElementById('waToggle');
    const menu = document.getElementById('waMenu');
    if (!toggle || !menu) return;

    function closeMenu(){
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    menu.querySelectorAll('.wa-menu-item').forEach(item => {
      item.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  /* ── SOCIAL ICONS (placeholder links) ── */
  document.querySelectorAll('.ft-social a').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
  });

  /* ── SMOOTH ANCHORS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t){ e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
