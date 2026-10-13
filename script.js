'use strict';
const config = window.SITE_CONFIG;
const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.message)}`;
document.querySelectorAll('[data-location]').forEach(element => { element.textContent = config.location; });
document.querySelectorAll('[data-location-faq]').forEach(element => { element.textContent = config.locationFaq; });
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl;
  link.addEventListener('click', () => {
    // Pronto para um acionador de evento personalizado no GTM. Sem dados de saúde ou identificadores.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'whatsapp_click', cta_location: link.dataset.whatsapp });
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-video]').forEach(slot => {
  const data = config.videos?.[slot.dataset.video];
  if (!data?.src) return;
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.src = data.src;
  video.setAttribute('aria-label', data.title);
  if (data.poster) video.poster = data.poster;
  if (data.captions) {
    const track = document.createElement('track');
    Object.assign(track, {kind:'captions', src:data.captions, srclang:'pt-BR', label:'Português', default:true});
    video.append(track);
  }
  slot.replaceChildren(video);
  slot.setAttribute('aria-label', data.title);
  if (data.transcript) {
    const details = document.createElement('details');
    details.className = 'video-transcript';
    const summary = document.createElement('summary');
    summary.textContent = 'Ler transcrição do vídeo';
    const text = document.createElement('p');
    text.textContent = data.transcript;
    details.append(summary, text);
    slot.after(details);
  }
});
// Etapas do atendimento: no desktop, a rolagem avança de 01 a 05 com a seção fixa na tela.
const tour = document.querySelector('[data-tour]');
if (tour) {
  const pinMedia = matchMedia('(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)');
  const sticky = tour.querySelector('.tour-sticky');
  const rail = tour.querySelector('.tour-rail');
  const steps = [...tour.querySelectorAll('.tour-step')];
  let active = 0;
  let ticking = false;
  const setActive = index => {
    active = index;
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
      step.classList.toggle('is-done', i < index);
    });
  };
  // A trilha vertical liga o centro do primeiro número ao centro do último.
  const measure = () => {
    const box = sticky.getBoundingClientRect();
    const first = steps[0].querySelector('.tour-number').getBoundingClientRect();
    const last = steps.at(-1).querySelector('.tour-number').getBoundingClientRect();
    Object.assign(rail.style, {
      left: `${first.left - box.left + first.width / 2}px`,
      top: `${first.top - box.top + first.height / 2}px`,
      height: `${last.top - first.top}px`
    });
  };
  const scrollable = () => tour.offsetHeight - innerHeight;
  const update = () => {
    ticking = false;
    if (!tour.classList.contains('is-pinned')) return;
    const progress = Math.min(1, Math.max(0, -tour.getBoundingClientRect().top / scrollable()));
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    // A barra alcança cada número no instante em que a etapa correspondente é ativada.
    tour.style.setProperty('--fill', Math.min(1, progress * steps.length / (steps.length - 1)).toFixed(4));
    if (index !== active) setActive(index);
  };
  const toggle = () => {
    const pinned = pinMedia.matches;
    tour.classList.toggle('is-pinned', pinned);
    steps.forEach(step => pinned ? step.setAttribute('tabindex', '0') : step.removeAttribute('tabindex'));
    if (pinned) { measure(); update(); } else { setActive(0); }
  };
  const goTo = index => {
    const top = tour.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (index + 0.5) / steps.length * scrollable(), behavior: 'smooth' });
  };
  steps.forEach((step, i) => {
    step.addEventListener('click', () => { if (tour.classList.contains('is-pinned')) goTo(i); });
    step.addEventListener('keydown', event => {
      if (tour.classList.contains('is-pinned') && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); goTo(i); }
    });
  });
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { if (tour.classList.contains('is-pinned')) { measure(); update(); } });
  addEventListener('load', () => { if (tour.classList.contains('is-pinned')) measure(); });
  pinMedia.addEventListener('change', toggle);
  toggle();
}
// Animações de entrada ao rolar. Grupos de itens aparecem em sequência; cada elemento anima uma única vez.
if (document.documentElement.classList.contains('motion') && 'IntersectionObserver' in window) {
  const groups = [
    '.movement-strip p', '.section-heading > *', '.situations article', '.section-note',
    '.therapy-copy > *', '.video-explainer > div:first-child > *', '.explainer-slot',
    '.care-heading', '.care-body > *', '.process-heading',
    '.about > div:last-child > :not(ul)', '.credentials li',
    '.testimonials-copy > *', '.testimonial-videos figure',
    '.faq-grid > div:first-child > *', '.questions details',
    '.final-inner > *', '.life-strip figure'
  ];
  const images = ['.therapy-photo', '.care-photo', '.about-visual'];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const reveal = (element, delay, type = '') => {
    element.setAttribute('data-reveal', type);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    observer.observe(element);
  };
  groups.forEach(selector => {
    const counters = new Map();
    document.querySelectorAll(selector).forEach(element => {
      const index = counters.get(element.parentElement) || 0;
      counters.set(element.parentElement, index + 1);
      reveal(element, Math.min(index, 5) * 90);
    });
  });
  images.forEach(selector => document.querySelectorAll(selector).forEach(element => reveal(element, 0, 'image')));
  // Fora do modo fixo (cards no mobile ou grade), a lista de etapas aparece como um bloco.
  if (!document.querySelector('.tour.is-pinned')) document.querySelectorAll('.tour-list').forEach(list => reveal(list, 0));
}
