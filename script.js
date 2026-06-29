// ===== Прогресс скролла + кнопка «наверх» =====
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
function onScroll() {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
  toTop.hidden = y < 500;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Мобильное меню =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);

function openMenu() {
  burger.classList.add('open'); nav.classList.add('open'); backdrop.classList.add('open');
  document.body.classList.add('menu-open'); burger.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  burger.classList.remove('open'); nav.classList.remove('open'); backdrop.classList.remove('open');
  document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => (nav.classList.contains('open') ? closeMenu() : openMenu()));
backdrop.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 720) closeMenu(); });

// ===== Reveal-анимации (с подстраховками — пустой страницы быть не может) =====
window.__revealReady = true;
const revealEls = document.querySelectorAll('.reveal');
const revealAll = () => revealEls.forEach((el) => el.classList.add('in'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));

  window.addEventListener('load', () => {
    revealEls.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in'); });
  });
  setTimeout(() => { if (document.querySelectorAll('.reveal.in').length === 0) revealAll(); }, 1800);
} else {
  revealAll();
}

// ===== Счётчики =====
const counters = document.querySelectorAll('[data-count]');
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const start = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = val.toLocaleString('ru-RU') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
if ('IntersectionObserver' in window && counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach((el) => cio.observe(el));
}

// ===== Маска телефона =====
const phone = document.getElementById('phone');
if (phone) {
  phone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7')) v = '7' + v;
    v = v.slice(0, 11);
    let out = '+7';
    if (v.length > 1) out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    e.target.value = out;
  });
}

// ===== Форма (заглушка без бэкенда) =====
const form = document.getElementById('orderForm');
const ok = document.getElementById('orderOk');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.name.value.trim() || form.phone.value.trim().length < 18) {
      alert('Пожалуйста, укажите имя и корректный номер телефона.');
      return;
    }
    // Подключите отправку: fetch('/api/order', { method:'POST', body:new FormData(form) }) или Telegram-бот / почта.
    ok.hidden = false; form.reset();
    setTimeout(() => (ok.hidden = true), 6000);
  });
}
