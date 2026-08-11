// Rotating hero: three headline blocks, Potreba lines as progress navigation.
// Autoplay is driven by the CSS fill animation (animationend advances the
// slide), so the progress line and the rotation can never drift apart.
// Pauses on hover/focus and via the explicit pause button; disabled entirely
// under prefers-reduced-motion (nav stays clickable).
export function initHeroSlider(root: HTMLElement) {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
  const navs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slide-nav]'));
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-pause]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = !reduced;
  let current = 0;

  // Per-word stagger delays, applied only while a slide is active.
  slides.forEach((slide) => {
    slide.querySelectorAll<HTMLElement>('.hero-word').forEach((word, i) => {
      word.style.setProperty('--wd', `${Math.min(i * 55, 660)}ms`);
    });
  });

  function restartFill(fill: HTMLElement, run: boolean) {
    fill.classList.remove('is-running');
    void fill.offsetWidth; // restart the CSS animation
    if (run) fill.classList.add('is-running');
  }

  function activate(index: number) {
    current = index;
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', String(!on));
    });
    navs.forEach((nav, i) => {
      const on = i === index;
      nav.classList.toggle('is-active', on);
      nav.setAttribute('aria-current', String(on));
      const fill = nav.querySelector<HTMLElement>('[data-fill]');
      if (fill) restartFill(fill, on && playing);
    });
  }

  navs.forEach((nav, i) => {
    nav.addEventListener('click', () => activate(i));
    const fill = nav.querySelector<HTMLElement>('[data-fill]');
    fill?.addEventListener('animationend', () => activate((current + 1) % slides.length));
  });

  if (pauseBtn) {
    if (reduced) pauseBtn.hidden = true;
    pauseBtn.addEventListener('click', () => {
      playing = !playing;
      pauseBtn.setAttribute('aria-pressed', String(!playing));
      pauseBtn.querySelector<HTMLElement>('[data-icon-pause]')?.toggleAttribute('hidden', !playing);
      pauseBtn.querySelector<HTMLElement>('[data-icon-play]')?.toggleAttribute('hidden', playing);
      const fill = navs[current]?.querySelector<HTMLElement>('[data-fill]');
      if (!playing) {
        fill?.classList.remove('is-running');
      } else if (fill) {
        restartFill(fill, true);
      }
    });
  }

  // Hover / keyboard focus inside the hero holds the rotation without
  // flipping the explicit play/pause state.
  root.addEventListener('mouseenter', () => root.classList.add('is-held'));
  root.addEventListener('mouseleave', () => root.classList.remove('is-held'));
  root.addEventListener('focusin', () => root.classList.add('is-held'));
  root.addEventListener('focusout', () => root.classList.remove('is-held'));

  activate(0);
}
