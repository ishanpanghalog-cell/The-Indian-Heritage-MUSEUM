import * as THREE from 'three';

export interface MuseumMaterialSet {
  sandstone: THREE.MeshStandardMaterial;
  sandstoneDark: THREE.MeshStandardMaterial;
  granite: THREE.MeshStandardMaterial;
  basalt: THREE.MeshStandardMaterial;
  limestone: THREE.MeshStandardMaterial;
  terracotta: THREE.MeshStandardMaterial;
  goldBrass: THREE.MeshStandardMaterial;
  softIron: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  mossStone: THREE.MeshStandardMaterial;
  woodBark: THREE.MeshStandardMaterial;
  floorMarble: THREE.MeshStandardMaterial;
  galleryWall: THREE.MeshStandardMaterial;
  galleryDado: THREE.MeshStandardMaterial;
  galleryFloor: THREE.MeshStandardMaterial;
  plasterLight: THREE.MeshStandardMaterial;
  velvetRope: THREE.MeshStandardMaterial;
  carvedRelief: THREE.MeshStandardMaterial;
  frescoOchre: THREE.MeshStandardMaterial;
  frescoLapis: THREE.MeshStandardMaterial;
}

function createStoneCanvas(
  baseHex: string,
  grainHex: string,
  veinHex: string,
  mode: 'ashlar' | 'granite' | 'basalt' | 'marble' | 'iron' | 'bark' | 'plaster' | 'wood' | 'tile'
): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  cCtx.fillStyle = baseHex;
  cCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  if (mode === 'ashlar') {
    const rows = 4;
    const rowH = size / rows;
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 === 0 ? 0 : size / 4;
      for (let c = 0; c < 3; c++) {
        const x = (c * (size / 2) + offset) % size;
        const y = r * rowH;
        const shade = (rand() - 0.5) * 14;
        cCtx.fillStyle = shade > 0 ? 'rgba(255,245,220,0.09)' : 'rgba(45,28,16,0.09)';
        cCtx.fillRect(x, y, size / 2 - 2, rowH - 2);
      }
      cCtx.fillStyle = grainHex;
      cCtx.fillRect(0, r * rowH, size, 2);
      bCtx.fillStyle = '#424242';
      bCtx.fillRect(0, r * rowH, size, 3);
    }
  }

  if (mode === 'tile') {
    const grid = 4;
    const step = size / grid;
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const alt = (r + c) % 2 === 0;
        cCtx.fillStyle = alt ? 'rgba(255,246,232,0.07)' : 'rgba(24,16,10,0.09)';
        cCtx.fillRect(c * step + 1, r * step + 1, step - 2, step - 2);
      }
      cCtx.fillStyle = grainHex;
      cCtx.fillRect(0, r * step, size, 2);
      cCtx.fillRect(r * step, 0, 2, size);
      bCtx.fillStyle = '#484848';
      bCtx.fillRect(0, r * step, size, 2);
      bCtx.fillRect(r * step, 0, 2, size);
    }
  }

  if (mode === 'marble') {
    cCtx.strokeStyle = veinHex;
    cCtx.lineWidth = 1.5;
    for (let i = 0; i < 16; i++) {
      cCtx.beginPath();
      let x = rand() * size;
      let y = rand() * size;
      cCtx.moveTo(x, y);
      for (let s = 0; s < 5; s++) {
        x += (rand() - 0.3) * 48;
        y += (rand() - 0.3) * 48;
        cCtx.lineTo(x, y);
      }
      cCtx.stroke();
    }
  }

  if (mode === 'bark' || mode === 'wood') {
    const lines = mode === 'wood' ? 96 : 64;
    for (let i = 0; i < lines; i++) {
      const x = rand() * size;
      cCtx.fillStyle = i % 2 === 0 ? grainHex : veinHex;
      cCtx.fillRect(x, 0, 1.5 + rand() * 3, size);
      bCtx.fillStyle = i % 2 === 0 ? '#a2a2a2' : '#5e5e5e';
      bCtx.fillRect(x, 0, 1.5 + rand() * 3, size);
    }
  }

  if (mode === 'plaster') {
    for (let i = 0; i < 24; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rad = 16 + rand() * 34;
      const grad = cCtx.createRadialGradient(x, y, 2, x, y, rad);
      grad.addColorStop(0, i % 2 === 0 ? 'rgba(255,244,225,0.04)' : 'rgba(22,14,9,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  }

  const count = mode === 'granite' ? 2400 : mode === 'iron' ? 900 : mode === 'plaster' ? 1000 : 1400;
  for (let i = 0; i < count; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = mode === 'granite' ? 1.6 : 1.2;
    cCtx.fillStyle = i % 3 === 0 ? veinHex : grainHex;
    cCtx.fillRect(x, y, r, r);
    bCtx.fillStyle = i % 2 === 0 ? '#949494' : '#6c6c6c';
    bCtx.fillRect(x, y, r, r);
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { colorMap, bumpMap };
}

function createCarvedReliefCanvas(baseHex: string, grooveHex: string, highlightHex: string): {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = size;
  b.height = size;
  const bCtx = b.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Carved temple frieze bands + rosette lotus medallions
  for (let row = 0; row < 4; row++) {
    const y = row * 64;
    ctx.fillStyle = grooveHex;
    ctx.fillRect(0, y, size, 4);
    ctx.fillStyle = highlightHex;
    ctx.fillRect(0, y + 6, size, 3);
    bCtx.fillStyle = '#383838';
    bCtx.fillRect(0, y, size, 4);
    bCtx.fillStyle = '#d0d0d0';
    bCtx.fillRect(0, y + 6, size, 4);

    for (let col = 0; col < 4; col++) {
      const cx = col * 64 + 32;
      const cy = y + 36;
      ctx.strokeStyle = grooveHex;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = highlightHex;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();

      bCtx.strokeStyle = '#3c3c3c';
      bCtx.lineWidth = 3;
      bCtx.beginPath();
      bCtx.arc(cx, cy, 18, 0, Math.PI * 2);
      bCtx.stroke();
      bCtx.fillStyle = '#d8d8d8';
      bCtx.beginPath();
      bCtx.arc(cx, cy, 9, 0, Math.PI * 2);
      bCtx.fill();
    }
  }

  const colorMap = new THREE.CanvasTexture(c);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(b);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { colorMap, bumpMap };
}

function createFrescoMuralTexture(bgHex: string, primaryHex: string, accentHex: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, size, size);

  // Ornamental Ajanta lotus border & aureole arches
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, size - 20, size - 20);
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, size - 40, size - 40);

  for (let i = 0; i < 3; i++) {
    const cx = 56 + i * 72;
    const cy = 128;
    // Sacred halo arch
    ctx.fillStyle = primaryHex;
    ctx.beginPath();
    ctx.arc(cx, cy - 22, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Stylized figure torso & lotus throne
    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 44);
    ctx.quadraticCurveTo(cx, cy - 6, cx + 20, cy + 44);
    ctx.closePath();
    ctx.fill();

    // Lotus petals below
    ctx.fillStyle = '#e6c589';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 52, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Aged mineral patina grain
  let seed = 99;
  for (let i = 0; i < 900; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = (seed % 256);
    seed = (seed * 16807) % 2147483647;
    const y = (seed % 256);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(35,22,14,0.12)' : 'rgba(245,225,185,0.08)';
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createNumberPlaqueTexture(numLabel: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1d1510';
  ctx.fillRect(0, 0, 128, 64);
  ctx.strokeStyle = '#d8a845';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 120, 56);

  ctx.fillStyle = '#f2d080';
  ctx.font = '600 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numLabel, 64, 34);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMuseumMaterials(maxAnisotropy = 4): MuseumMaterialSet {
  const applyAniso = (t: THREE.Texture, rep = 2) => {
    t.repeat.set(rep, rep);
    t.anisotropy = Math.min(8, maxAnisotropy);
  };

  const sandTex = createStoneCanvas('#d6b98c', 'rgba(130, 96, 56, 0.25)', 'rgba(248, 232, 200, 0.16)', 'ashlar');
  applyAniso(sandTex.colorMap, 2);
  applyAniso(sandTex.bumpMap, 2);

  const sandDarkTex = createStoneCanvas('#b48a5a', 'rgba(72, 46, 26, 0.28)', 'rgba(218, 185, 138, 0.14)', 'ashlar');
  applyAniso(sandDarkTex.colorMap, 2);
  applyAniso(sandDarkTex.bumpMap, 2);

  const graniteTex = createStoneCanvas('#9a8976', 'rgba(54, 45, 38, 0.34)', 'rgba(232, 220, 204, 0.28)', 'granite');
  applyAniso(graniteTex.colorMap, 3);
  applyAniso(graniteTex.bumpMap, 3);

  const basaltTex = createStoneCanvas('#564b46', 'rgba(32, 27, 25, 0.42)', 'rgba(122, 108, 98, 0.24)', 'basalt');
  applyAniso(basaltTex.colorMap, 2);
  applyAniso(basaltTex.bumpMap, 2);

  const limestoneTex = createStoneCanvas('#c7bda9', 'rgba(105, 95, 82, 0.26)', 'rgba(245, 240, 228, 0.22)', 'ashlar');
  applyAniso(limestoneTex.colorMap, 2);
  applyAniso(limestoneTex.bumpMap, 2);

  const marbleTex = createStoneCanvas('#e4d9c6', 'rgba(165, 148, 122, 0.18)', 'rgba(155, 125, 84, 0.24)', 'marble');
  applyAniso(marbleTex.colorMap, 5);
  applyAniso(marbleTex.bumpMap, 5);

  const ironTex = createStoneCanvas('#4a4847', 'rgba(25, 24, 24, 0.35)', 'rgba(160, 154, 148, 0.2)', 'iron');
  applyAniso(ironTex.colorMap, 2);
  applyAniso(ironTex.bumpMap, 2);

  const barkTex = createStoneCanvas('#5c4632', 'rgba(38, 26, 16, 0.45)', 'rgba(125, 100, 68, 0.28)', 'bark');
  applyAniso(barkTex.colorMap, 2);
  applyAniso(barkTex.bumpMap, 2);

  const galleryWallTex = createStoneCanvas('#49392e', 'rgba(26, 18, 13, 0.2)', 'rgba(110, 88, 70, 0.15)', 'plaster');
  applyAniso(galleryWallTex.colorMap, 3);
  applyAniso(galleryWallTex.bumpMap, 3);

  const galleryDadoTex = createStoneCanvas('#2f2219', 'rgba(18, 12, 8, 0.35)', 'rgba(85, 62, 42, 0.25)', 'wood');
  applyAniso(galleryDadoTex.colorMap, 3);
  applyAniso(galleryDadoTex.bumpMap, 3);

  const galleryFloorTex = createStoneCanvas('#745f4d', 'rgba(42, 31, 23, 0.32)', 'rgba(218, 198, 168, 0.18)', 'tile');
  applyAniso(galleryFloorTex.colorMap, 8);
  applyAniso(galleryFloorTex.bumpMap, 8);

  const reliefTex = createCarvedReliefCanvas('#c9a675', 'rgba(72, 48, 28, 0.55)', 'rgba(246, 224, 184, 0.35)');
  applyAniso(reliefTex.colorMap, 2);
  applyAniso(reliefTex.bumpMap, 2);

  const frescoOchreTex = createFrescoMuralTexture('#8e4a2b', '#c6833e', '#d6b472');
  frescoOchreTex.anisotropy = Math.min(8, maxAnisotropy);
  const frescoLapisTex = createFrescoMuralTexture('#2f4c69', '#5a83a6', '#d8b46e');
  frescoLapisTex.anisotropy = Math.min(8, maxAnisotropy);

  return {
    sandstone: new THREE.MeshStandardMaterial({
      map: sandTex.colorMap,
      bumpMap: sandTex.bumpMap,
      bumpScale: 0.035,
      roughness: 0.82,
      metalness: 0.04,
    }),
    sandstoneDark: new THREE.MeshStandardMaterial({
      map: sandDarkTex.colorMap,
      bumpMap: sandDarkTex.bumpMap,
      bumpScale: 0.04,
      roughness: 0.78,
      metalness: 0.06,
    }),
    granite: new THREE.MeshStandardMaterial({
      map: graniteTex.colorMap,
      bumpMap: graniteTex.bumpMap,
      bumpScale: 0.045,
      roughness: 0.72,
      metalness: 0.1,
    }),
    basalt: new THREE.MeshStandardMaterial({
      map: basaltTex.colorMap,
      bumpMap: basaltTex.bumpMap,
      bumpScale: 0.055,
      roughness: 0.86,
      metalness: 0.08,
    }),
    limestone: new THREE.MeshStandardMaterial({
      map: limestoneTex.colorMap,
      bumpMap: limestoneTex.bumpMap,
      bumpScale: 0.035,
      roughness: 0.76,
      metalness: 0.05,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xa44b2a,
      bumpMap: sandTex.bumpMap,
      bumpScale: 0.03,
      roughness: 0.74,
      metalness: 0.05,
    }),
    goldBrass: new THREE.MeshStandardMaterial({
      color: 0xd8a845,
      roughness: 0.22,
      metalness: 0.9,
    }),
    softIron: new THREE.MeshStandardMaterial({
      map: ironTex.colorMap,
      bumpMap: ironTex.bumpMap,
      bumpScale: 0.025,
      roughness: 0.36,
      metalness: 0.86,
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x1e6b78,
      roughness: 0.09,
      metalness: 0.32,
      transparent: true,
      opacity: 0.86,
    }),
    mossStone: new THREE.MeshStandardMaterial({
      color: 0x4c6848,
      bumpMap: basaltTex.bumpMap,
      bumpScale: 0.05,
      roughness: 0.9,
      metalness: 0.02,
    }),
    woodBark: new THREE.MeshStandardMaterial({
      map: barkTex.colorMap,
      bumpMap: barkTex.bumpMap,
      bumpScale: 0.05,
      roughness: 0.86,
      metalness: 0.02,
    }),
    floorMarble: new THREE.MeshStandardMaterial({
      map: marbleTex.colorMap,
      bumpMap: marbleTex.bumpMap,
      bumpScale: 0.015,
      roughness: 0.32,
      metalness: 0.1,
    }),
    galleryWall: new THREE.MeshStandardMaterial({
      map: galleryWallTex.colorMap,
      bumpMap: galleryWallTex.bumpMap,
      bumpScale: 0.02,
      roughness: 0.88,
      metalness: 0.02,
    }),
    galleryDado: new THREE.MeshStandardMaterial({
      map: galleryDadoTex.colorMap,
      bumpMap: galleryDadoTex.bumpMap,
      bumpScale: 0.025,
      roughness: 0.62,
      metalness: 0.05,
    }),
    galleryFloor: new THREE.MeshStandardMaterial({
      map: galleryFloorTex.colorMap,
      bumpMap: galleryFloorTex.bumpMap,
      bumpScale: 0.02,
      roughness: 0.44,
      metalness: 0.08,
    }),
    plasterLight: new THREE.MeshStandardMaterial({
      color: 0xdfd5c3,
      roughness: 0.72,
      metalness: 0.04,
    }),
    velvetRope: new THREE.MeshStandardMaterial({
      color: 0x6f1f1f,
      roughness: 0.92,
      metalness: 0.04,
    }),
    carvedRelief: new THREE.MeshStandardMaterial({
      map: reliefTex.colorMap,
      bumpMap: reliefTex.bumpMap,
      bumpScale: 0.06,
      roughness: 0.75,
      metalness: 0.06,
    }),
    frescoOchre: new THREE.MeshStandardMaterial({
      map: frescoOchreTex,
      roughness: 0.78,
      metalness: 0.04,
    }),
    frescoLapis: new THREE.MeshStandardMaterial({
      map: frescoLapisTex,
      roughness: 0.78,
      metalness: 0.04,
    }),
  };
}
