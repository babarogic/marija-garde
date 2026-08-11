// Cursor parallax for the hero photo. The image leans away from the pointer
// by a few pixels, smoothed with a lerp so it trails the cursor instead of
// snapping to it. Pointer-only: touch devices and prefers-reduced-motion get
// a static image, and listening on the hero itself means the loop stops on
// its own once the pointer leaves or the section scrolls away.
const MAX_SHIFT = 14; // px of drift at the far edge of the section
const EASE = 0.075; // lerp factor — lower trails more heavily
const SETTLED = 0.05; // px, below which the loop can stop

export function initHeroParallax(root: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced || !fine) return;

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let running = false;

  function tick() {
    x += (targetX - x) * EASE;
    y += (targetY - y) * EASE;
    root.style.setProperty('--px', `${x.toFixed(2)}px`);
    root.style.setProperty('--py', `${y.toFixed(2)}px`);

    if (Math.abs(targetX - x) < SETTLED && Math.abs(targetY - y) < SETTLED) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(tick);
  }

  root.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const box = root.getBoundingClientRect();
      // -1..1 from the centre of the hero, negated so the photo leans away.
      targetX = -(((e.clientX - box.left) / box.width) * 2 - 1) * MAX_SHIFT;
      targetY = -(((e.clientY - box.top) / box.height) * 2 - 1) * MAX_SHIFT;
      start();
    },
    { passive: true }
  );

  root.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    start();
  });
}
