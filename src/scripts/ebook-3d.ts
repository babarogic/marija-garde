// Interactive 3D e-book for the ebook band. Loaded lazily (dynamic import)
// only when the section approaches the viewport, so three.js never blocks
// the initial page. Cover art is drawn on canvas with the brand palette and
// the site's own fonts — no image assets. If anything here throws, the
// caller keeps the static fallback image.
import * as THREE from 'three';

const CREAM = '#fff4e2';
const ESPRESSO = '#53433c';
const CORAL = '#ec7f6b';
const PAGES = '#f8ecd6';

const TITLE_LINES = ['Niste izgubili', 'strpljenje,', 'iscrpeli', 'ste sebe'];

function coverTexture(): THREE.CanvasTexture {
  const w = 768;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);

  // Thin frame, coral mark, eyebrow, italic serif title, author.
  ctx.strokeStyle = 'rgba(83, 67, 60, 0.25)';
  ctx.lineWidth = 3;
  ctx.strokeRect(42, 42, w - 84, h - 84);

  ctx.fillStyle = CORAL;
  ctx.beginPath();
  ctx.arc(108, 148, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(83, 67, 60, 0.8)';
  ctx.font = '500 30px Switzer, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('B E S P L A T A N   E - B O O K', 88, 254);

  ctx.fillStyle = ESPRESSO;
  ctx.font = 'italic 400 92px Lora, Georgia, serif';
  TITLE_LINES.forEach((line, i) => {
    ctx.fillText(line, 88, 430 + i * 112);
  });

  ctx.fillStyle = ESPRESSO;
  ctx.font = '500 32px Switzer, sans-serif';
  ctx.fillText('M A R I J A   G A R D E', 88, h - 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function backTexture(): THREE.CanvasTexture {
  const w = 768;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(83, 67, 60, 0.25)';
  ctx.lineWidth = 3;
  ctx.strokeRect(42, 42, w - 84, h - 84);
  ctx.fillStyle = CORAL;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 20, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function spineTexture(): THREE.CanvasTexture {
  const w = 160;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = CORAL;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = CREAM;
  ctx.font = '500 34px Switzer, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NISTE IZGUBILI STRPLJENJE, ISCRPELI STE SEBE', 0, 0);
  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export async function initEbook3D(host: HTMLElement): Promise<void> {
  // Cover text is drawn with the site fonts — wait for them.
  await document.fonts.ready;

  const width = host.clientWidth;
  const height = host.clientHeight;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 20);
  camera.position.set(0, 0, 4.4);

  scene.add(new THREE.AmbientLight(0xfff4e2, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf1bb99, 0.5);
  fill.position.set(-3, -1, 2);
  scene.add(fill);

  const pagesMaterial = new THREE.MeshStandardMaterial({ color: PAGES, roughness: 0.9 });
  const coverOptions = { roughness: 0.7, metalness: 0 };
  const materials = [
    pagesMaterial, // +x pages edge
    new THREE.MeshStandardMaterial({ ...coverOptions, map: spineTexture() }), // -x spine
    pagesMaterial, // +y top
    pagesMaterial, // -y bottom
    new THREE.MeshStandardMaterial({ ...coverOptions, map: coverTexture() }), // +z front
    new THREE.MeshStandardMaterial({ ...coverOptions, map: backTexture() }), // -z back
  ];

  const book = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.24), materials);
  const group = new THREE.Group();
  group.add(book);
  group.rotation.set(0.08, -0.35, 0.02);
  scene.add(group);

  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.classList.add('absolute', 'inset-0', 'h-full', 'w-full');
  host.append(canvas);
  host.querySelector('[data-ebook-fallback]')?.remove();

  new ResizeObserver(() => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reduced) renderer.render(scene, camera);
  }).observe(host);

  if (reduced) {
    renderer.render(scene, camera);
    return;
  }

  // Cursor tilt is tracked over the whole band, not just the small canvas.
  const tiltArea = host.closest('section') ?? host;
  let targetX = 0;
  let targetY = 0;
  tiltArea.addEventListener('pointermove', (event) => {
    const rect = tiltArea.getBoundingClientRect();
    targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
    targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
  });
  tiltArea.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    const idleY = Math.sin(t * 0.6) * 0.07;
    const idleFloat = Math.sin(t * 0.9) * 0.035;
    group.rotation.y += (-0.35 + idleY + targetY - group.rotation.y) * 0.05;
    group.rotation.x += (0.08 + targetX - group.rotation.x) * 0.05;
    group.position.y += (idleFloat - group.position.y) * 0.05;
    renderer.render(scene, camera);
  });
}
