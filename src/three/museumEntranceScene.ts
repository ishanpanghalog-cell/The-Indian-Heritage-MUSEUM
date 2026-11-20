import * as THREE from 'three';
import { EXHIBITS } from '../data/museumData';
import { ExhibitId } from '../types/museum';
import { buildMuseumMonumentSpecimen } from './exhibitSpecimens';
import { createMuseumMaterials, createNumberPlaqueTexture } from './proceduralTextures';
import {
  addMuseumStudioLighting,
  createMuseumRenderer,
  createRadialContactShadow,
  createRenderController,
  disposeSceneObjects,
} from './webglUtils';

const CARVED_SANDSTONE_URL = '/src/assets/images/sandstone_carved_tile_1795023536896.jpg';

export interface EntranceHoverState {
  exhibitId: ExhibitId | null;
  screenX: number;
  screenY: number;
}

export interface EntranceWalkCallbacks {
  onSelectExhibit: (id: ExhibitId) => void;
  onHoverExhibit: (state: EntranceHoverState) => void;
  onWalkProgress?: (progress: number, nearestExhibitId: ExhibitId | null) => void;
}

export interface MuseumEntranceController {
  setScrollProgress: (progress: number) => void;
  highlightExhibit: (id: ExhibitId | null) => void;
  cleanup: () => void;
}

export const WALK_STOPS: { id: 'gateway' | ExhibitId | 'rotunda'; progress: number }[] = [
  { id: 'gateway', progress: 0.14 },
  ...EXHIBITS.map((ex, idx) => ({
    id: ex.id,
    progress: 0.25 + idx * 0.075,
  })),
  { id: 'rotunda', progress: 0.98 },
];

// Reusable math objects (zero GC in render loop)
const _camPos = new THREE.Vector3();
const _lookPos = new THREE.Vector3();

function createSoftGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 240, 185, 1)');
    grad.addColorStop(0.4, 'rgba(255, 200, 95, 0.65)');
    grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTwilightSkyDome(): THREE.Mesh {
  const skyGeo = new THREE.SphereGeometry(76, 32, 24);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color(0x060508) },
      uMidColor: { value: new THREE.Color(0x3f1d13) },
      uHorizonColor: { value: new THREE.Color(0xd67428) },
      uGlowColor: { value: new THREE.Color(0xffc766) },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uMidColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uGlowColor;
      varying vec3 vWorldPos;
      void main() {
        vec3 dir = normalize(vWorldPos);
        float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(uHorizonColor, uMidColor, smoothstep(0.47, 0.65, h));
        col = mix(col, uTopColor, smoothstep(0.62, 0.88, h));
        float centerSun = max(0.0, dot(normalize(vec3(dir.x, dir.y - 0.06, dir.z)), normalize(vec3(0.0, 0.06, -1.0))));
        col += uGlowColor * pow(centerSun, 12.0) * 0.55;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  return new THREE.Mesh(skyGeo, skyMat);
}

function createTempleColumn(
  height: number,
  scaleRadius: number,
  stoneMat: THREE.Material,
  darkMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  const base1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.16 * scaleRadius, 0.28, 1.16 * scaleRadius),
    darkMat
  );
  base1.position.y = 0.14;
  base1.castShadow = true;
  base1.receiveShadow = true;
  group.add(base1);

  const base2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.94 * scaleRadius, 0.22, 0.94 * scaleRadius),
    stoneMat
  );
  base2.position.y = 0.39;
  base2.castShadow = true;
  group.add(base2);

  const shaftH = Math.max(1.8, height - 0.95);
  const r = scaleRadius;
  const lathePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.42 * r, 0),
    new THREE.Vector2(0.46 * r, 0.14),
    new THREE.Vector2(0.36 * r, 0.28),
    new THREE.Vector2(0.32 * r, 0.42),
    new THREE.Vector2(0.34 * r, shaftH * 0.45),
    new THREE.Vector2(0.29 * r, shaftH * 0.72),
    new THREE.Vector2(0.35 * r, shaftH * 0.8),
    new THREE.Vector2(0.26 * r, shaftH * 0.86),
    new THREE.Vector2(0.42 * r, shaftH * 0.95),
    new THREE.Vector2(0.46 * r, shaftH),
    new THREE.Vector2(0.01, shaftH),
  ];

  const shaft = new THREE.Mesh(new THREE.LatheGeometry(lathePoints, 16), stoneMat);
  shaft.position.y = 0.5;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  group.add(shaft);

  const lowerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.35 * r, 0.035 * r, 10, 24),
    brassMat
  );
  lowerRing.rotation.x = Math.PI / 2;
  lowerRing.position.y = 0.5 + shaftH * 0.24;
  group.add(lowerRing);

  const upperRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.34 * r, 0.038 * r, 10, 24),
    brassMat
  );
  upperRing.rotation.x = Math.PI / 2;
  upperRing.position.y = 0.5 + shaftH * 0.8;
  group.add(upperRing);

  const capNeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.92 * r, 0.2, 0.92 * r),
    darkMat
  );
  capNeck.position.y = 0.5 + shaftH + 0.1;
  capNeck.castShadow = true;
  group.add(capNeck);

  const corbelArms = new THREE.Mesh(
    new THREE.BoxGeometry(1.58 * r, 0.24, 0.76 * r),
    stoneMat
  );
  corbelArms.position.y = 0.5 + shaftH + 0.32;
  corbelArms.castShadow = true;
  group.add(corbelArms);

  return group;
}

function createCuspedToranaArch(
  spanWidth: number,
  archHeight: number,
  stoneMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const halfSpan = spanWidth / 2;

  const outer = new THREE.Shape();
  outer.moveTo(-halfSpan, 0);
  outer.lineTo(-halfSpan, archHeight);
  outer.lineTo(halfSpan, archHeight);
  outer.lineTo(halfSpan, 0);
  outer.closePath();

  const inner = new THREE.Path();
  const innerW = halfSpan - 0.24;
  inner.moveTo(-innerW, 0);
  inner.lineTo(-innerW, archHeight * 0.36);
  inner.quadraticCurveTo(-innerW * 0.88, archHeight * 0.62, -innerW * 0.56, archHeight * 0.66);
  inner.quadraticCurveTo(-innerW * 0.32, archHeight * 0.88, 0, archHeight * 0.93);
  inner.quadraticCurveTo(innerW * 0.32, archHeight * 0.88, innerW * 0.56, archHeight * 0.66);
  inner.quadraticCurveTo(innerW * 0.88, archHeight * 0.62, innerW, archHeight * 0.36);
  inner.lineTo(innerW, 0);
  inner.closePath();

  outer.holes.push(inner);

  const extrudeGeo = new THREE.ExtrudeGeometry(outer, {
    depth: 0.44,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 20,
  });
  extrudeGeo.translate(0, 0, -0.22);

  const archMesh = new THREE.Mesh(extrudeGeo, stoneMat);
  archMesh.castShadow = true;
  archMesh.receiveShadow = true;
  group.add(archMesh);

  const apexBoss = new THREE.Mesh(new THREE.OctahedronGeometry(0.19, 1), brassMat);
  apexBoss.position.set(0, archHeight * 0.92, 0.25);
  group.add(apexBoss);

  return group;
}

function createMiniatureShikhara(
  scale: number,
  stoneMat: THREE.Material,
  darkMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const g = new THREE.Group();
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const w = (1.15 - t * 0.72) * scale;
    const h = 0.24 * scale;
    const tier = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, w),
      i % 2 === 0 ? stoneMat : darkMat
    );
    tier.position.y = h / 2 + i * h * 0.92;
    tier.castShadow = true;
    g.add(tier);
  }
  const topY = tiers * 0.24 * scale * 0.92;
  const amalaka = new THREE.Mesh(
    new THREE.TorusGeometry(0.24 * scale, 0.08 * scale, 10, 16),
    stoneMat
  );
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.y = topY + 0.06 * scale;
  g.add(amalaka);

  const kalasa = new THREE.Mesh(
    new THREE.ConeGeometry(0.11 * scale, 0.44 * scale, 12),
    brassMat
  );
  kalasa.position.y = topY + 0.34 * scale;
  g.add(kalasa);

  return g;
}

function createKonarkSolarChakra(
  radius: number,
  brassMat: THREE.Material,
  stoneMat: THREE.Material
): THREE.Group {
  const wheel = new THREE.Group();

  const outerRim = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.085, 14, 48), brassMat);
  wheel.add(outerRim);

  const innerRim = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.84, radius * 0.04, 10, 36),
    stoneMat
  );
  wheel.add(innerRim);

  const spokeCount = 16;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const isMajor = i % 2 === 0;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isMajor ? radius * 0.032 : radius * 0.016,
        isMajor ? radius * 0.04 : radius * 0.02,
        radius * 1.66,
        8
      ),
      brassMat
    );
    spoke.rotation.z = angle;
    wheel.add(spoke);
  }

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.2, radius * 0.26, radius * 0.28, 16),
    brassMat
  );
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);

  const lotusBoss = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.14, 14, 10), brassMat);
  lotusBoss.position.z = radius * 0.14;
  wheel.add(lotusBoss);

  return wheel;
}

function createDeepastambha(
  brassMat: THREE.Material,
  darkMat: THREE.Material,
  flameMat: THREE.Material,
  haloMat: THREE.Material
): { group: THREE.Group; flame: THREE.Mesh; halo: THREE.Mesh } {
  const group = new THREE.Group();

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 0.62), darkMat);
  plinth.position.y = 0.17;
  plinth.castShadow = true;
  group.add(plinth);

  const stemPts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.14, 0.16),
    new THREE.Vector2(0.11, 0.72),
    new THREE.Vector2(0.22, 0.88),
    new THREE.Vector2(0.08, 0.96),
    new THREE.Vector2(0.26, 1.12),
    new THREE.Vector2(0.18, 1.18),
    new THREE.Vector2(0.01, 1.18),
  ];
  const stem = new THREE.Mesh(new THREE.LatheGeometry(stemPts, 16), brassMat);
  stem.position.y = 0.34;
  stem.castShadow = true;
  group.add(stem);

  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.22, 10), flameMat);
  flame.position.y = 1.62;
  group.add(flame);

  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), haloMat);
  halo.position.y = 1.6;
  group.add(halo);

  return { group, flame, halo };
}

export function mountMuseumEntranceScene(
  container: HTMLElement,
  callbacks?: EntranceWalkCallbacks
): MuseumEntranceController {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x140d0a);
  scene.fog = new THREE.FogExp2(0x1f120c, 0.011);

  const { renderer, isSoftwareGl, pmremTexture } = createMuseumRenderer(container, scene, {
    clearColor: 0x140d0a,
  });
  renderer.toneMappingExposure = 1.18;

  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 240);
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 130);

  const skyDome = createTwilightSkyDome();
  scene.add(skyDome);

  addMuseumStudioLighting(scene, { keyPosition: [8, 14, 12], shadowExtent: 16 });
  const warmSun = new THREE.DirectionalLight(0xffcb78, 1.45);
  warmSun.position.set(-7, 8, 11);
  scene.add(warmSun);

  // Key atmospheric lights from Courtyard -> Gateway -> Corridor -> Rotunda
  const poolLight = new THREE.PointLight(0xffb84d, 8, 16, 1.5);
  poolLight.position.set(0, 2.3, 4.4);
  scene.add(poolLight);

  const gatewayGlow = new THREE.PointLight(0xffa942, 18, 22, 1.3);
  gatewayGlow.position.set(0, 4.2, -3.5);
  scene.add(gatewayGlow);

  for (const lz of [-15, -31, -47]) {
    const hallLamp = new THREE.PointLight(0xffd79a, 24, 24, 1.25);
    hallLamp.position.set(0, 6.2, lz);
    scene.add(hallLamp);
  }

  const rotundaOculusLight = new THREE.PointLight(0xffe4ad, 36, 28, 1.2);
  rotundaOculusLight.position.set(0, 8.0, -61.5);
  scene.add(rotundaOculusLight);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const mats = createMuseumMaterials(maxAniso);

  const courtyardMat = mats.basalt.clone();
  courtyardMat.color.setHex(0x3f322a);
  courtyardMat.roughness = 0.62;

  const carvedStoneMat = mats.sandstone.clone();
  carvedStoneMat.color.setHex(0xdfb882);

  const root = new THREE.Group();
  root.position.y = -0.35;
  scene.add(root);

  const extraTextures: THREE.Texture[] = [];

  // =========================================================================
  // 1. OUTER TWILIGHT COURTYARD, TWIN REFLECTING POOLS & CENTRAL WALKWAY
  // =========================================================================
  const courtyardFloor = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), courtyardMat);
  courtyardFloor.rotation.x = -Math.PI / 2;
  courtyardFloor.position.set(0, 0, 12);
  courtyardFloor.receiveShadow = true;
  root.add(courtyardFloor);

  const plinthShadow = createRadialContactShadow(11.5, 0.52);
  plinthShadow.position.set(0, 0.015, -1.6);
  root.add(plinthShadow);

  // Central sandstone ceremonial walkway crossing the courtyard up to the steps
  const approachPath = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 12.5), carvedStoneMat);
  approachPath.position.set(0, 0.1, 7.2);
  approachPath.receiveShadow = true;
  root.add(approachPath);

  const pathRunnerMat = mats.goldBrass;
  for (const rx of [-1.18, 1.18]) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 12.4), pathRunnerMat);
    runner.position.set(rx, 0.21, 7.2);
    root.add(runner);
  }

  // Twin symmetrical reflecting Kund pools flanking the central walkway
  const poolWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0c2830,
    emissive: 0x2b1706,
    emissiveIntensity: 0.48,
    roughness: 0.08,
    metalness: 0.72,
  });
  const shimmerMat = new THREE.MeshBasicMaterial({
    color: 0xffcf70,
    transparent: true,
    opacity: 0.28,
  });
  const shimmerMeshes: THREE.Mesh[] = [];

  for (const side of [-1, 1]) {
    const poolRim = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.18, 7.6), mats.sandstoneDark);
    poolRim.position.set(side * 2.85, 0.09, 5.4);
    poolRim.receiveShadow = true;
    root.add(poolRim);

    const water = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 6.9), poolWaterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(side * 2.85, 0.19, 5.4);
    root.add(water);

    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.07), shimmerMat);
      bar.rotation.x = -Math.PI / 2;
      bar.position.set(side * 2.85, 0.196, 3.0 + i * 1.45);
      root.add(bar);
      shimmerMeshes.push(bar);
    }
  }

  // Grand Stepped Adhishthana Terrace rising smoothly from courtyard (y=0) to Museum Floor (y=1.0)
  for (let s = 0; s < 4; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(16.6 - s * 0.75, 0.25, 4.6 - s * 0.65),
      s % 2 === 0 ? mats.sandstoneDark : carvedStoneMat
    );
    step.position.set(0, 0.125 + s * 0.25, 0.1 - s * 0.42);
    step.receiveShadow = true;
    root.add(step);
  }

  // Four Ornate Brass Deepastambha Lamp Pillars flanking the courtyard path
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe494 });
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffa630,
    transparent: true,
    opacity: 0.28,
  });
  const lampRefs: { flame: THREE.Mesh; halo: THREE.Mesh }[] = [];
  const lampPositions: [number, number][] = [
    [-2.05, 2.3],
    [2.05, 2.3],
    [-2.05, 8.2],
    [2.05, 8.2],
  ];
  lampPositions.forEach(([lx, lz]) => {
    const lamp = createDeepastambha(mats.goldBrass, mats.sandstoneDark, flameMat, haloMat);
    lamp.group.position.set(lx, 0, lz);
    root.add(lamp.group);
    lampRefs.push({ flame: lamp.flame, halo: lamp.halo });
  });

  // =========================================================================
  // 2. MONUMENTAL TORANA GATEWAY (OPEN PORTAL INTO THE MUSEUM HALL)
  // =========================================================================
  const mainLeft = createTempleColumn(5.1, 1.04, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
  mainLeft.position.set(-2.65, 1.0, -0.85);
  root.add(mainLeft);

  const mainRight = createTempleColumn(5.1, 1.04, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
  mainRight.position.set(2.65, 1.0, -0.85);
  root.add(mainRight);

  const wingConfigs: [number, number, number][] = [
    [-5.05, -1.45, 4.45],
    [5.05, -1.45, 4.45],
    [-7.15, -2.05, 4.05],
    [7.15, -2.05, 4.05],
  ];
  wingConfigs.forEach(([wx, wz, wh]) => {
    const col = createTempleColumn(wh, 0.82, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
    col.position.set(wx, 1.0, wz);
    root.add(col);
  });

  // Open Cusped Makara-Torana Arch (generous clearance for camera walk-through!)
  const cuspedArch = createCuspedToranaArch(4.7, 2.35, carvedStoneMat, mats.goldBrass);
  cuspedArch.position.set(0, 3.65, -0.85);
  root.add(cuspedArch);

  const lowerLintel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.42, 0.98), carvedStoneMat);
  lowerLintel.position.set(0, 6.22, -0.85);
  lowerLintel.castShadow = true;
  root.add(lowerLintel);

  const upperCornice = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.34, 1.18), mats.sandstoneDark);
  upperCornice.position.set(0, 6.6, -0.85);
  upperCornice.castShadow = true;
  root.add(upperCornice);

  [-1, 1].forEach((side) => {
    const wingBeam = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.36, 0.82), carvedStoneMat);
    wingBeam.position.set(side * 6.0, 5.38, -1.75);
    wingBeam.rotation.y = side * -0.22;
    wingBeam.castShadow = true;
    root.add(wingBeam);

    const miniShikhara = createMiniatureShikhara(0.95, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
    miniShikhara.position.set(side * 5.05, 5.56, -1.45);
    root.add(miniShikhara);
  });

  const solarChakra = createKonarkSolarChakra(0.96, mats.goldBrass, mats.sandstoneDark);
  solarChakra.position.set(0, 7.66, -0.78);
  root.add(solarChakra);

  [-2.65, 2.65].forEach((sx) => {
    const sideTower = createMiniatureShikhara(1.06, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
    sideTower.position.set(sx, 6.77, -0.85);
    root.add(sideTower);
  });

  // Museum Entrance Facade Curtain Wall right behind the Torana (with open central portal)
  for (const side of [-1, 1]) {
    const facadeWing = new THREE.Mesh(new THREE.BoxGeometry(5.6, 6.8, 0.65), mats.sandstoneDark);
    facadeWing.position.set(side * 5.1, 4.4, -2.55);
    facadeWing.receiveShadow = true;
    root.add(facadeWing);
  }
  const portalHeaderWall = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.1, 0.65), mats.sandstoneDark);
  portalHeaderWall.position.set(0, 6.8, -2.55);
  root.add(portalHeaderWall);

  // =========================================================================
  // 3. GRAND COLONNADED MUSEUM PROMENADE HALL (Z = -2.5 to Z = -67)
  // =========================================================================
  const hallGroup = new THREE.Group();
  root.add(hallGroup);

  const hallStartZ = -2.5;
  const hallLength = 66.0;
  const hallCenterZ = hallStartZ - hallLength / 2;

  // Main sandstone hall floor
  const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(15.2, hallLength), mats.galleryFloor);
  hallFloor.rotation.x = -Math.PI / 2;
  hallFloor.position.set(0, 1.0, hallCenterZ);
  hallFloor.receiveShadow = true;
  hallGroup.add(hallFloor);

  // Polished marble central promenade path runner + brass inlay borders
  const walkwayMarble = new THREE.Mesh(new THREE.PlaneGeometry(3.8, hallLength - 2.0), mats.floorMarble);
  walkwayMarble.rotation.x = -Math.PI / 2;
  walkwayMarble.position.set(0, 1.012, hallCenterZ);
  walkwayMarble.receiveShadow = true;
  hallGroup.add(walkwayMarble);

  for (const bx of [-1.88, 1.88]) {
    const brassStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.08, hallLength - 2.0), mats.goldBrass);
    brassStrip.rotation.x = -Math.PI / 2;
    brassStrip.position.set(bx, 1.018, hallCenterZ);
    hallGroup.add(brassStrip);
  }

  // Longitudinal Dado, Gallery Walls & Clerestory Skylight Ceiling
  for (const side of [-1, 1]) {
    const dado = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.35, hallLength), mats.galleryDado);
    dado.position.set(side * 7.45, 1.675, hallCenterZ);
    hallGroup.add(dado);

    const dadoRail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, hallLength), mats.sandstoneDark);
    dadoRail.position.set(side * 7.4, 2.4, hallCenterZ);
    hallGroup.add(dadoRail);

    const upperWall = new THREE.Mesh(new THREE.BoxGeometry(0.32, 5.4, hallLength), mats.galleryWall);
    upperWall.position.set(side * 7.45, 5.15, hallCenterZ);
    hallGroup.add(upperWall);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, hallLength), mats.sandstoneDark);
    cornice.position.set(side * 7.25, 7.85, hallCenterZ);
    hallGroup.add(cornice);

    // Side ceiling slope
    const sideRoof = new THREE.Mesh(new THREE.PlaneGeometry(5.6, hallLength), mats.galleryWall);
    sideRoof.rotation.x = Math.PI / 2;
    sideRoof.rotation.y = side * -0.18;
    sideRoof.position.set(side * 4.8, 8.2, hallCenterZ);
    hallGroup.add(sideRoof);
  }

  // Luminous golden museum skylight strip along the vaulted ceiling spine
  const skylightStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, hallLength - 4.0),
    new THREE.MeshBasicMaterial({ color: 0xffe8bb, side: THREE.DoubleSide })
  );
  skylightStrip.rotation.x = Math.PI / 2;
  skylightStrip.position.set(0, 8.75, hallCenterZ);
  hallGroup.add(skylightStrip);

  // Rhythmic Colonnade Bays + Transverse Arched Ribs + Framed Heritage Frescoes
  const baySpacing = 5.5;
  const bayCount = 11;
  for (let b = 0; b < bayCount; b++) {
    const bz = -5.5 - b * baySpacing;
    for (const side of [-1, 1]) {
      const col = createTempleColumn(5.6, 0.72, carvedStoneMat, mats.sandstoneDark, mats.goldBrass);
      col.position.set(side * 5.2, 1.0, bz);
      hallGroup.add(col);

      // Framed Ajanta-inspired fresco panel centered between columns
      const panelZ = bz - baySpacing * 0.5;
      if (b < bayCount - 1) {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 2.2), mats.goldBrass);
        frame.position.set(side * 7.24, 4.35, panelZ);
        const frescoMat = (b + (side > 0 ? 1 : 0)) % 2 === 0 ? mats.frescoOchre : mats.frescoLapis;
        const fresco = new THREE.Mesh(new THREE.PlaneGeometry(1.96, 2.36), frescoMat);
        fresco.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
        fresco.position.set(side * 7.17, 4.35, panelZ);
        hallGroup.add(frame, fresco);
      }
    }

    // Transverse sandstone rib arch spanning the corridor overhead
    const ribCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 6.6, bz),
      new THREE.Vector3(-2.6, 8.15, bz),
      new THREE.Vector3(0, 8.65, bz),
      new THREE.Vector3(2.6, 8.15, bz),
      new THREE.Vector3(5.2, 6.6, bz),
    ]);
    const rib = new THREE.Mesh(
      new THREE.TubeGeometry(ribCurve, 18, 0.16, 8, false),
      mats.sandstoneDark
    );
    hallGroup.add(rib);
  }

  // =========================================================================
  // 4. NINE MONUMENT EXHIBITS FLANKING THE CENTRAL MUSEUM PATH
  // =========================================================================
  const clickables: THREE.Object3D[] = [];
  const pedestalTops: Map<ExhibitId, THREE.Mesh> = new Map();
  const monumentPositions: { id: ExhibitId; x: number; z: number; side: number }[] = [];

  const stanchionPostGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.72, 10);
  const stanchionCapGeo = new THREE.SphereGeometry(0.055, 10, 8);
  const sconceMat = new THREE.MeshBasicMaterial({ color: 0xffdf99 });

  EXHIBITS.forEach((exhibit, idx) => {
    const side = idx % 2 === 0 ? -1 : 1; // Alternating Left (-1) and Right (+1) along path
    const mz = -9.0 - idx * 5.35;
    const mx = side * 3.15;
    monumentPositions.push({ id: exhibit.id, x: mx, z: mz, side });

    // Brass inlay spur from central path runner to pedestal
    const spur = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.07), mats.goldBrass);
    spur.rotation.x = -Math.PI / 2;
    spur.position.set(side * 2.45, 1.016, mz);
    hallGroup.add(spur);

    const bayGroup = new THREE.Group();
    bayGroup.position.set(mx, 1.0, mz);
    // Angle each monument slightly toward the incoming visitor walking down the center path
    bayGroup.rotation.y = side === -1 ? Math.PI * 0.34 : -Math.PI * 0.34;

    const shadow = createRadialContactShadow(1.38, 0.46);
    bayGroup.add(shadow);

    // Octagonal stepped museum plinth
    const plinthBase = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.15, 0.2, 8), mats.basalt);
    plinthBase.position.y = 0.1;
    plinthBase.receiveShadow = true;
    bayGroup.add(plinthBase);

    const plinthBody = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.96, 0.92, 8), mats.sandstoneDark);
    plinthBody.position.y = 0.66;
    plinthBody.castShadow = true;
    plinthBody.receiveShadow = true;
    bayGroup.add(plinthBody);

    const brassCap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.09, 20), mats.goldBrass);
    brassCap.position.y = 1.16;
    bayGroup.add(brassCap);
    pedestalTops.set(exhibit.id, brassCap);

    // Engraved Exhibit Number Plaque facing the walkway
    const numTex = createNumberPlaqueTexture(exhibit.number);
    numTex.anisotropy = Math.min(8, maxAniso);
    extraTextures.push(numTex);
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.24),
      new THREE.MeshStandardMaterial({ map: numTex, roughness: 0.4, metalness: 0.2 })
    );
    plaque.position.set(0, 0.72, 0.9);
    bayGroup.add(plaque);

    // Velvet museum stanchions guarding the front of the pedestal
    for (const sx of [-0.72, 0.72]) {
      const post = new THREE.Mesh(stanchionPostGeo, mats.goldBrass);
      post.position.set(sx, 0.36, 1.25);
      const knob = new THREE.Mesh(stanchionCapGeo, mats.goldBrass);
      knob.position.set(sx, 0.74, 1.25);
      bayGroup.add(post, knob);
    }
    const ropeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, 0.65, 1.25),
      new THREE.Vector3(0, 0.53, 1.29),
      new THREE.Vector3(0.72, 0.65, 1.25),
    ]);
    const rope = new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 12, 0.024, 6, false), mats.velvetRope);
    bayGroup.add(rope);

    // Overhead brass gallery sconce fixture illuminating the monument
    const sconceDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.08, 16), mats.goldBrass);
    sconceDisk.position.set(0, 4.35, 0);
    const sconceBulb = new THREE.Mesh(new THREE.CircleGeometry(0.28, 16), sconceMat);
    sconceBulb.rotation.x = Math.PI / 2;
    sconceBulb.position.set(0, 4.3, 0);
    bayGroup.add(sconceDisk, sconceBulb);

    // Scaled-up architectural specimen model atop the plinth
    const specimen = buildMuseumMonumentSpecimen(exhibit.id, mats);
    specimen.scale.setScalar(1.36);
    specimen.position.y = 1.21;
    bayGroup.add(specimen);

    // Invisible simplified hitbox for smooth hover preview & click navigation
    const hitbox = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 2.95, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitbox.position.y = 1.5;
    hitbox.userData.exhibitId = exhibit.id;
    bayGroup.add(hitbox);
    clickables.push(hitbox);

    hallGroup.add(bayGroup);
  });

  // =========================================================================
  // 5. ROTUNDA THRESHOLD & CENTRAL SURYA ARMILLARY SPHERE (END OF PATH)
  // =========================================================================
  const rotundaZ = -62.5;
  const endWall = new THREE.Mesh(new THREE.BoxGeometry(15.4, 7.6, 0.45), mats.galleryWall);
  endWall.position.set(0, 4.8, -68.2);
  hallGroup.add(endWall);

  const endArch = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.24, 10, 24, Math.PI),
    carvedStoneMat
  );
  endArch.position.set(0, 4.2, -67.85);
  hallGroup.add(endArch);

  const endFresco = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.2), mats.frescoOchre);
  endFresco.position.set(0, 3.4, -67.92);
  hallGroup.add(endFresco);

  const rotundaRing = new THREE.Mesh(new THREE.RingGeometry(2.4, 2.55, 48), mats.goldBrass);
  rotundaRing.rotation.x = -Math.PI / 2;
  rotundaRing.position.set(0, 1.02, rotundaZ);
  hallGroup.add(rotundaRing);

  const armillaryBase = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.32, 0.9, 8), mats.sandstoneDark);
  armillaryBase.position.set(0, 1.45, rotundaZ);
  hallGroup.add(armillaryBase);

  const armillaryCap = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.08, 16), mats.goldBrass);
  armillaryCap.position.set(0, 1.92, rotundaZ);
  hallGroup.add(armillaryCap);

  const endArmillary = new THREE.Group();
  endArmillary.position.set(0, 2.95, rotundaZ);
  const er1 = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.045, 10, 36), mats.goldBrass);
  const er2 = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.036, 10, 32), mats.goldBrass);
  er2.rotation.x = Math.PI / 3;
  const er3 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.028, 10, 28), mats.goldBrass);
  er3.rotation.y = Math.PI / 4;
  const eSun = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 14), mats.goldBrass);
  endArmillary.add(er1, er2, er3, eSun);
  hallGroup.add(endArmillary);

  // Soft golden dust motes floating in the courtyard & gateway
  const glowTex = createSoftGlowTexture();
  const moteCount = 90;
  const motePositions = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePositions[i * 3] = ((i * 73) % 100) / 10 - 5.0;
    motePositions[i * 3 + 1] = 1.4 + (((i * 37) % 100) / 100) * 5.8;
    motePositions[i * 3 + 2] = 10.0 - (((i * 53) % 100) / 100) * 65.0;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
  const moteMat = new THREE.PointsMaterial({
    map: glowTex,
    color: 0xffdf8e,
    size: 0.22,
    transparent: true,
    opacity: 0.72,
    alphaTest: 0.02,
    depthWrite: false,
  });
  const motes = new THREE.Points(moteGeo, moteMat);
  root.add(motes);

  // =========================================================================
  // 6. EYE-LEVEL SCROLL-WALK CAMERA PATH SPLINES
  // =========================================================================
  const camPoints: THREE.Vector3[] = [
    new THREE.Vector3(0, 2.45, 14.2), // 0.00 Outer courtyard overlooking gateway
    new THREE.Vector3(0, 2.55, 5.2),  // 0.14 Approaching Torana steps
    new THREE.Vector3(0, 2.75, -1.0), // 0.21 Stepping right through the Torana portal
  ];
  const lookPoints: THREE.Vector3[] = [
    new THREE.Vector3(0, 3.35, -1.0),
    new THREE.Vector3(0, 2.85, -10.5),
    new THREE.Vector3(0, 2.65, -15.0),
  ];

  monumentPositions.forEach((m) => {
    // Walk down the center aisle, drifting gracefully slightly away from the pedestal for great framing
    camPoints.push(new THREE.Vector3(-m.side * 0.58, 2.68, m.z + 3.65));
    lookPoints.push(new THREE.Vector3(m.side * 1.95, 2.45, m.z - 0.55));
  });

  // Final stop overlooking the Central Rotunda Armillary Sphere
  camPoints.push(new THREE.Vector3(0, 2.78, -54.8));
  lookPoints.push(new THREE.Vector3(0, 2.7, rotundaZ));

  const camCurve = new THREE.CatmullRomCurve3(camPoints, false, 'catmullrom', 0.35);
  const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.35);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let targetProgress = 0;
  let currentProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastReportedProgress = -1;
  let lastNearestId: ExhibitId | null = null;

  const updateCameraFromProgress = (p: number, elapsed: number) => {
    const clampedP = THREE.MathUtils.clamp(p, 0, 1);
    camCurve.getPoint(clampedP, _camPos);
    lookCurve.getPoint(clampedP, _lookPos);

    // Gentle human walking stride micro-bob while scrolling through the museum
    if (!reducedMotion && !isSoftwareGl) {
      const walkEnergy = Math.min(1, Math.abs(targetProgress - currentProgress) * 18);
      _camPos.y += Math.sin(clampedP * 95) * 0.03 * (0.25 + walkEnergy * 0.75);
      _camPos.x += pointerX * 0.16;
      _lookPos.x += pointerX * 0.65 + Math.sin(elapsed * 0.35) * 0.08;
      _lookPos.y += -pointerY * 0.32;
    }

    camera.position.copy(_camPos);
    camera.lookAt(_lookPos);
  };

  updateCameraFromProgress(0, 0);
  renderer.render(scene, camera);

  // =========================================================================
  // 7. RAYCASTING FOR MONUMENT HOVER PREVIEW & CLICK
  // =========================================================================
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let lastMoveRaycast = 0;
  let pointerDownPos = { x: 0, y: 0 };
  let hoveredId: ExhibitId | null = null;

  const setHoveredVisual = (id: ExhibitId | null) => {
    pedestalTops.forEach((capMesh, exId) => {
      capMesh.scale.setScalar(exId === id ? 1.15 : 1.0);
    });
  };

  const updatePointerNdc = (ev: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    pointerX = pointer.x;
    pointerY = -pointer.y;
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const onPointerDown = (ev: PointerEvent) => {
    pointerDownPos = { x: ev.clientX, y: ev.clientY };
  };

  const onPointerMove = (ev: PointerEvent) => {
    const localPos = updatePointerNdc(ev);
    const now = performance.now();
    if (now - lastMoveRaycast < 38) return;
    lastMoveRaycast = now;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    const hitId = hits.length > 0 ? (hits[0].object.userData.exhibitId as ExhibitId) : null;

    if (hitId !== hoveredId) {
      hoveredId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'default';
      setHoveredVisual(hitId);
      controller.requestRender();
    }
    callbacks?.onHoverExhibit({
      exhibitId: hitId,
      screenX: localPos.x,
      screenY: localPos.y,
    });
  };

  const onPointerLeave = () => {
    if (hoveredId !== null) {
      hoveredId = null;
      renderer.domElement.style.cursor = 'default';
      setHoveredVisual(null);
      controller.requestRender();
    }
    callbacks?.onHoverExhibit({ exhibitId: null, screenX: 0, screenY: 0 });
  };

  const onPointerUp = (ev: PointerEvent) => {
    const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
    if (dist > 6) return;
    updatePointerNdc(ev);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    if (hits.length > 0) {
      const id = hits[0].object.userData.exhibitId as ExhibitId;
      if (id) callbacks?.onSelectExhibit(id);
    }
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  const findNearestExhibit = (p: number): ExhibitId | null => {
    if (p < 0.19 || p > 0.93) return null;
    let bestId: ExhibitId | null = null;
    let bestDist = Infinity;
    for (let i = 0; i < EXHIBITS.length; i++) {
      const stopP = 0.25 + i * 0.075;
      const d = Math.abs(p - stopP);
      if (d < bestDist && d < 0.055) {
        bestDist = d;
        bestId = EXHIBITS[i].id;
      }
    }
    return bestId;
  };

  const controller = createRenderController(renderer, isSoftwareGl, (dt, elapsed) => {
    if (reducedMotion || isSoftwareGl) {
      currentProgress = targetProgress;
    } else {
      currentProgress = THREE.MathUtils.damp(currentProgress, targetProgress, 5.2, dt);
    }

    updateCameraFromProgress(currentProgress, elapsed);

    const nearest = findNearestExhibit(currentProgress);
    if (
      Math.abs(currentProgress - lastReportedProgress) > 0.004 ||
      nearest !== lastNearestId
    ) {
      lastReportedProgress = currentProgress;
      lastNearestId = nearest;
      callbacks?.onWalkProgress?.(currentProgress, nearest);
    }

    if (!reducedMotion && !isSoftwareGl) {
      solarChakra.rotation.z = elapsed * 0.18;
      endArmillary.rotation.y = elapsed * 0.28;

      lampRefs.forEach((l, idx) => {
        const flicker = 0.92 + Math.sin(elapsed * 5.2 + idx * 1.3) * 0.12;
        l.flame.scale.set(1, flicker, 1);
        l.halo.scale.setScalar(0.94 + Math.cos(elapsed * 3.8 + idx) * 0.08);
      });

      shimmerMeshes.forEach((bar, idx) => {
        bar.position.x += Math.sin(elapsed * 1.4 + idx * 0.8) * 0.0008;
      });
    }

    renderer.render(scene, camera);
    const settling = Math.abs(targetProgress - currentProgress) > 0.0006;
    return (!reducedMotion && !isSoftwareGl) || settling;
  });

  let disposed = false;
  const texLoader = new THREE.TextureLoader();
  texLoader.load(
    CARVED_SANDSTONE_URL,
    (loadedTex) => {
      if (disposed) {
        loadedTex.dispose();
        return;
      }
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      loadedTex.wrapS = THREE.RepeatWrapping;
      loadedTex.wrapT = THREE.RepeatWrapping;
      loadedTex.repeat.set(2, 2);
      loadedTex.anisotropy = Math.min(8, maxAniso);
      carvedStoneMat.map = loadedTex;
      carvedStoneMat.needsUpdate = true;
      controller.requestRender();
    },
    undefined,
    () => {
      // Fallback to procedural sandstone texture
    }
  );

  if (reducedMotion || isSoftwareGl) {
    controller.requestRender();
  } else {
    controller.setContinuous(true);
  }

  const handleResize = () => {
    const w = Math.max(container.clientWidth, 320);
    const h = Math.max(container.clientHeight, 240);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    controller.requestRender();
  };
  window.addEventListener('resize', handleResize);

  return {
    setScrollProgress(progress: number) {
      targetProgress = THREE.MathUtils.clamp(progress, 0, 1);
      if (isSoftwareGl || reducedMotion) {
        currentProgress = targetProgress;
        updateCameraFromProgress(currentProgress, 0);
      }
      controller.requestRender();
    },
    highlightExhibit(id: ExhibitId | null) {
      setHoveredVisual(id);
      controller.requestRender();
    },
    cleanup() {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controller.dispose();
      glowTex.dispose();
      extraTextures.forEach((t) => t.dispose());
      disposeSceneObjects(root);
      disposeSceneObjects(skyDome);
      pmremTexture.dispose();
      renderer.dispose();
    },
  };
}
