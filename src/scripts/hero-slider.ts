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

  // The rotation runs continuously. It only holds while the pointer or the
  // keyboard focus is on a control the user is about to act on — the CTA or
  // one of the slide buttons — so reading the hero never freezes it. Holding
  // this way does not flip the explicit play/pause state.
  //
  // Hovering the hero as a whole used to hold it, which in a full-bleed hero
  // meant the rotation was paused almost permanently: the pointer is inside
  // the section nearly all the time.
  const held = new Set<HTMLElement>();

  function syncHold() {
    root.classList.toggle('is-held', held.size > 0);
  }

  root.querySelectorAll<HTMLElement>('[data-hero-hold]').forEach((el) => {
    const hold = () => {
      held.add(el);
      syncHold();
    };
    const release = () => {
      held.delete(el);
      syncHold();
    };
    // pointerenter/leave rather than mouseenter/leave so a touch tap that
    // lands on a control releases cleanly; pointercancel avoids a stale hold.
    el.addEventListener('pointerenter', hold);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', release);
  });

  activate(0);
}
