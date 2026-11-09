/* Scrollbar custom — remplace la scrollbar native sur desktop (pointeur précis).
   Firefox ne permet ni d'arrondir ni de retirer les chevrons via CSS : la barre
   native est donc masquée (cf. v4.css) et redessinée ici, identique partout. */
(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root  = document.documentElement;
  const PAD   = 4;   // marge haut/bas de la piste (px)
  const MIN_H = 36;  // hauteur minimale du pouce (px)

  const track = document.createElement('div');
  track.className = 'cs-track';
  track.setAttribute('aria-hidden', 'true');
  const thumb = document.createElement('div');
  thumb.className = 'cs-thumb';
  track.appendChild(thumb);

  let thumbH = 0, trackH = 0, maxScroll = 0, raf = 0;
  let drag = null; // { startY, startScroll }

  function measure() {
    raf = 0;
    const view = window.innerHeight;
    maxScroll = root.scrollHeight - view;
    const locked = document.body.style.overflow === 'hidden';
    const hidden = maxScroll <= 1 || locked;
    track.classList.toggle('cs-hidden', hidden);
    if (hidden) return;
    trackH = view - PAD * 2;
    thumbH = Math.max(MIN_H, trackH * view / root.scrollHeight);
    const y = PAD + (trackH - thumbH) * Math.min(1, Math.max(0, window.scrollY / maxScroll));
    thumb.style.height = thumbH + 'px';
    thumb.style.transform = `translateY(${y}px)`;
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };

  // Glisser le pouce
  thumb.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    thumb.setPointerCapture(e.pointerId);
    drag = { startY: e.clientY, startScroll: window.scrollY };
    root.classList.add('cs-dragging');
  });
  thumb.addEventListener('pointermove', e => {
    if (!drag) return;
    const ratio = maxScroll / Math.max(1, trackH - thumbH);
    window.scrollTo({ top: drag.startScroll + (e.clientY - drag.startY) * ratio, behavior: 'instant' });
  });
  const endDrag = () => { drag = null; root.classList.remove('cs-dragging'); };
  thumb.addEventListener('pointerup', endDrag);
  thumb.addEventListener('pointercancel', endDrag);

  // Clic sur la piste : centre le pouce sur le point cliqué
  track.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target === thumb) return;
    e.preventDefault();
    const pos = (e.clientY - PAD - thumbH / 2) / Math.max(1, trackH - thumbH);
    window.scrollTo({ top: Math.min(1, Math.max(0, pos)) * maxScroll, behavior: 'smooth' });
  });

  function init() {
    document.body.appendChild(track);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    new ResizeObserver(schedule).observe(document.body);
    // Le menu mobile bloque le scroll via body.style.overflow
    new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ['style'] });
    measure();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
