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
