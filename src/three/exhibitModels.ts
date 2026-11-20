import * as THREE from 'three';
import { ExhibitId, ViewerModeId } from '../types/museum';
import { MuseumMaterialSet } from './proceduralTextures';
import { createRadialContactShadow } from './webglUtils';

export interface BuiltExhibitModel {
  group: THREE.Group;
  setMode: (mode: ViewerModeId) => void;
  update: (dt: number, elapsed: number, mode: ViewerModeId) => boolean;
}

function addBox(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  castShadow = true
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCyl(
  parent: THREE.Object3D,
  rt: number,
  rb: number,
  h: number,
  segs: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(rt, rb, h, segs);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addLatheColumn(
  parent: THREE.Object3D,
  height: number,
  radius: number,
  stoneMat: THREE.Material,
  darkMat: THREE.Material,
  brassMat?: THREE.Material
): THREE.Group {
  const col = new THREE.Group();
  addBox(col, radius * 2.5, height * 0.1, radius * 2.5, 0, height * 0.05, 0, darkMat);

  const shaftH = height * 0.78;
  const pts = [
    new THREE.Vector2(0.005, 0),
    new THREE.Vector2(radius * 1.15, 0),
    new THREE.Vector2(radius * 0.92, shaftH * 0.12),
    new THREE.Vector2(radius * 0.85, shaftH * 0.55),
    new THREE.Vector2(radius * 0.78, shaftH * 0.78),
    new THREE.Vector2(radius * 1.12, shaftH * 0.88),
    new THREE.Vector2(radius * 0.74, shaftH * 0.92),
    new THREE.Vector2(radius * 1.18, shaftH),
    new THREE.Vector2(0.005, shaftH),
  ];
  const shaft = new THREE.Mesh(new THREE.LatheGeometry(pts, 14), stoneMat);
  shaft.position.y = height * 0.1;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  col.add(shaft);

  if (brassMat) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.88, radius * 0.1, 8, 16), brassMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = height * 0.1 + shaftH * 0.78;
    col.add(ring);
  }

  addBox(col, radius * 2.8, height * 0.12, radius * 2.1, 0, height * 0.94, 0, darkMat);
  parent.add(col);
  return col;
}

function addAmalakaFinial(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  scale: number,
  stoneMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Ribbed Amalaka stone cushion disc
  const amalaka = new THREE.Mesh(
    new THREE.TorusGeometry(0.24 * scale, 0.11 * scale, 10, 18),
    stoneMat
  );
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.y = 0.08 * scale;
  amalaka.castShadow = true;
  g.add(amalaka);

  for (let r = 0; r < 10; r++) {
    const a = (r / 10) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 0.2 * scale, 6),
      stoneMat
    );
    rib.position.set(Math.cos(a) * 0.31 * scale, 0.08 * scale, Math.sin(a) * 0.31 * scale);
    g.add(rib);
  }

  // Khapuri bell + brass Kalasa pot spire
  const kalasaPts = [
    new THREE.Vector2(0.005, 0),
    new THREE.Vector2(0.18 * scale, 0),
    new THREE.Vector2(0.12 * scale, 0.1 * scale),
    new THREE.Vector2(0.16 * scale, 0.22 * scale),
    new THREE.Vector2(0.05 * scale, 0.34 * scale),
    new THREE.Vector2(0.08 * scale, 0.42 * scale),
    new THREE.Vector2(0.015 * scale, 0.62 * scale),
    new THREE.Vector2(0.001, 0.68 * scale),
  ];
  const kalasa = new THREE.Mesh(new THREE.LatheGeometry(kalasaPts, 14), brassMat);
  kalasa.position.y = 0.16 * scale;
  kalasa.castShadow = true;
  g.add(kalasa);

  parent.add(g);
  return g;
}

function addMuseumBase(group: THREE.Group, mats: MuseumMaterialSet, radius = 3.7): void {
  const contact = createRadialContactShadow(radius + 0.3, 0.42);
  contact.position.y = 0.012;
  group.add(contact);
  // Low chamfered slate mounting pad sitting flush on top of the gallery pedestal (y = 0)
  addCyl(group, radius - 0.12, radius, 0.06, 48, 0, 0.03, 0, mats.basalt);
}

// 1. ANCIENT WATER ENGINEERING LAB (Stepwell / Chand Baori Architecture)
function buildWaterLab(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.85);

  const basin = new THREE.Group();
  basin.position.y = 0.05;
  group.add(basin);

  // Outer stepped stone masonry walls with carved cornice trim
  addBox(basin, 5.4, 2.3, 0.42, 0, 1.15, -2.5, mats.sandstone);
  addBox(basin, 0.42, 2.3, 5.4, -2.5, 1.15, 0, mats.sandstone);
  addBox(basin, 0.42, 2.3, 5.4, 2.5, 1.15, 0, mats.sandstone);
  addBox(basin, 5.6, 0.14, 0.56, 0, 2.34, -2.5, mats.carvedRelief);
  addBox(basin, 0.56, 0.14, 5.6, -2.5, 2.34, 0, mats.carvedRelief);
  addBox(basin, 0.56, 0.14, 5.6, 2.5, 2.34, 0, mats.carvedRelief);

  const frontWallGroup = new THREE.Group();
  addBox(frontWallGroup, 5.4, 2.3, 0.42, 0, 1.15, 2.5, mats.sandstone);
  addBox(frontWallGroup, 5.6, 0.14, 0.56, 0, 2.34, 2.5, mats.carvedRelief);
  basin.add(frontWallGroup);

  // Authentic Chand Baori style triangular criss-crossing descending stairways on 3 sides
  const buildBaoriSideFlights = (
    parent: THREE.Object3D,
    tierCount: number,
    yTop: number,
    yBottom: number,
    edgeZ: number,
    dirZ: number
  ) => {
    for (let t = 0; t < tierCount; t++) {
      const yTier = THREE.MathUtils.lerp(yTop, yBottom, t / tierCount);
      const zTier = edgeZ + dirZ * (t * 0.44 + 0.24);
      const spanW = 4.4 - t * 0.72;
      // Horizontal landing terrace
      addBox(parent, spanW, 0.14, 0.42, 0, yTier - 0.08, zTier, mats.sandstoneDark);

      // Pair of triangular converging stair flights on each landing
      const flightPositions = spanW > 2.2 ? [-1.05, 1.05] : [0];
      flightPositions.forEach((fx) => {
        for (let st = 0; st < 4; st++) {
          const stepH = (yTop - yBottom) / tierCount;
          const sy = yTier - (st * stepH) / 4;
          const sxL = fx - 0.34 + st * 0.09;
          const sxR = fx + 0.34 - st * 0.09;
          addBox(parent, 0.22, 0.1, 0.28, sxL, sy, zTier + dirZ * 0.22, mats.limestone);
          addBox(parent, 0.22, 0.1, 0.28, sxR, sy, zTier + dirZ * 0.22, mats.limestone);
        }
      });
    }
  };

  buildBaoriSideFlights(basin, 4, 2.05, 0.55, -2.25, 1);

  // Left & Right side terraced galleries with carved arches
  for (const side of [-1, 1]) {
    const sideGroup = new THREE.Group();
    for (let tier = 0; tier < 4; tier++) {
      const y = 1.98 - tier * 0.45;
      const x = side * (2.1 - tier * 0.38);
      const span = 4.4 - tier * 0.76;
      addBox(sideGroup, 0.38, 0.18, span, x, y, 0, mats.sandstoneDark);
      // Individual step flights along side wall
      for (let st = 0; st < 5; st++) {
        addBox(sideGroup, 0.34, 0.11, 0.34, x - side * 0.18, y - st * 0.08, -1.1 + st * 0.55, mats.limestone);
      }
    }
    basin.add(sideGroup);
  }

  // Ornate Back Jharokha Colonnade Pavilion with Carved Chhatri Dome
  const pavY = 2.4;
  addBox(basin, 5.1, 0.18, 0.9, 0, pavY, -2.55, mats.sandstoneDark);
  for (let i = -2; i <= 2; i++) {
    addLatheColumn(basin, 1.15, 0.11, mats.sandstone, mats.sandstoneDark, mats.goldBrass).position.set(
      i * 1.05,
      pavY + 0.08,
      -2.5
    );
  }
  // Overhanging curved Chhajja eaves & central Chhatri dome
  addBox(basin, 5.3, 0.14, 1.05, 0, pavY + 1.3, -2.5, mats.sandstoneDark);
  const chhatriDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.terracotta
  );
  chhatriDome.position.set(0, pavY + 1.36, -2.5);
  chhatriDome.castShadow = true;
  basin.add(chhatriDome);
  addAmalakaFinial(basin, 0, pavY + 1.88, -2.5, 0.55, mats.sandstone, mats.goldBrass);

  // Carved Stone Intake Aqueduct & Silt Settling Basin
  addBox(basin, 1.95, 0.34, 0.86, -3.45, 2.02, 0, mats.sandstoneDark);
  addBox(basin, 1.95, 0.24, 0.14, -3.45, 2.3, 0.36, mats.carvedRelief);
  addBox(basin, 1.95, 0.24, 0.14, -3.45, 2.3, -0.36, mats.carvedRelief);
  addBox(basin, 0.95, 0.58, 0.98, -2.65, 1.88, 0, mats.limestone);

  // Subterranean Reservoir Pool
  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.44, 2.6), mats.water);
  waterMesh.position.set(0, 0.34, 0.15);
  group.add(waterMesh);

  // Animated Monsoon Inflow Stream & Cascade
  const streamMat = new THREE.MeshStandardMaterial({
    color: 0x3eb8c9,
    emissive: 0x10454f,
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity: 0.88,
  });
  const streamChannel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.46), streamMat);
  streamChannel.position.set(-3.38, 2.24, 0);
  streamChannel.visible = false;
  group.add(streamChannel);

  const waterDrops: THREE.Mesh[] = [];
  const dropGeo = new THREE.SphereGeometry(0.085, 10, 10);
  for (let i = 0; i < 8; i++) {
    const d = new THREE.Mesh(dropGeo, streamMat);
    d.visible = false;
    group.add(d);
    waterDrops.push(d);
  }

  let currentMode: ViewerModeId = 'standard';

  return {
    group,
    setMode(mode) {
      currentMode = mode;
      frontWallGroup.visible = mode !== 'cutaway';
      const isAnim = mode === 'animated';
      streamChannel.visible = isAnim;
      waterDrops.forEach((d) => {
        d.visible = isAnim;
      });
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated' || currentMode === 'animated') {
        const wave = Math.sin(elapsed * 1.8) * 0.18;
        waterMesh.position.y = 0.52 + wave;
        waterDrops.forEach((d, idx) => {
          const t = (elapsed * 1.2 + idx / waterDrops.length) % 1;
          d.position.x = -2.3 + t * 1.05;
          d.position.y = 2.15 - t * t * 1.65;
          d.position.z = Math.sin(idx * 2.1) * 0.14;
        });
        return true;
      }
      waterMesh.position.y = 0.34;
      return false;
    },
  };
}

// 2. BRIHADEESWARAR TEMPLE (THANJAVUR)
function buildBrihadeeswarar(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.9);

  // Molded Adhishthana Granite Plinth
  addBox(group, 4.35, 0.24, 6.9, 0, 0.18, 0.15, mats.basalt);
  addBox(group, 4.1, 0.24, 6.65, 0, 0.42, 0.15, mats.granite);
  addBox(group, 4.22, 0.08, 6.76, 0, 0.56, 0.15, mats.carvedRelief);

  // Pillared Mukhamandapa & Maha-Mandapa Hall with Carved Pilasters & Kapota Eaves
  addBox(group, 2.25, 1.18, 2.35, 0, 1.18, 0.45, mats.granite);
  addBox(group, 2.48, 0.14, 2.55, 0, 1.82, 0.45, mats.carvedRelief);
  for (const px of [-0.95, -0.32, 0.32, 0.95]) {
    addLatheColumn(group, 1.15, 0.085, mats.sandstoneDark, mats.granite).position.set(px, 0.6, 1.66);
  }

  // Nandi Pavilion with Stepped Chola Roof & Sculpted Anatomical Nandi
  addBox(group, 1.68, 0.2, 1.68, 0, 0.66, 2.85, mats.granite);
  for (const sx of [-0.66, 0.66]) {
    for (const sz of [2.22, 3.48]) {
      addLatheColumn(group, 1.15, 0.085, mats.sandstoneDark, mats.granite, mats.goldBrass).position.set(
        sx,
        0.76,
        sz
      );
    }
  }
  addBox(group, 1.84, 0.14, 1.84, 0, 1.94, 2.85, mats.granite);
  addBox(group, 1.48, 0.18, 1.48, 0, 2.08, 2.85, mats.carvedRelief);
  addAmalakaFinial(group, 0, 2.18, 2.85, 0.42, mats.granite, mats.goldBrass);

  // Sculpted Monolithic Nandi Bull
  const nandi = new THREE.Group();
  nandi.position.set(0, 0.76, 2.85);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 6, 12), mats.basalt);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0.24, 0.04);
  body.castShadow = true;
  const hump = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), mats.basalt);
  hump.scale.set(0.85, 1.1, 0.95);
  hump.position.set(0, 0.42, -0.14);
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 6, 10), mats.basalt);
  head.rotation.x = Math.PI / 3;
  head.position.set(0, 0.44, -0.36);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 6, 16), mats.goldBrass);
  collar.rotation.x = Math.PI / 4;
  collar.position.set(0, 0.34, -0.22);
  addCyl(nandi, 0.025, 0.01, 0.2, 8, -0.09, 0.6, -0.36, mats.goldBrass).rotation.z = 0.28;
  addCyl(nandi, 0.025, 0.01, 0.2, 8, 0.09, 0.6, -0.36, mats.goldBrass).rotation.z = -0.28;
  nandi.add(body, hump, head, collar);
  group.add(nandi);

  // 13-Tiered Dravidian Vimana with Bhadra Projections & Corner Kutas
  const vimanaCenterZ = -1.75;
  const vimanaOuterFront = new THREE.Group();
  const vimanaCore = new THREE.Group();
  group.add(vimanaCore);
  group.add(vimanaOuterFront);

  // Inner Garbhagriha & Sacred Mahalingam (revealed in Cutaway)
  addCyl(vimanaCore, 0.46, 0.5, 0.18, 18, 0, 0.68, vimanaCenterZ, mats.granite);
  addCyl(vimanaCore, 0.22, 0.25, 0.62, 18, 0, 0.98, vimanaCenterZ, mats.basalt);

  const tiers = 13;
  for (let i = 0; i < tiers; i++) {
    const t = i / (tiers - 1);
    const width = 2.85 - t * 1.82;
    const h = 0.24;
    const y = 0.72 + i * 0.265;
    const thickness = 0.26;
    const mat = i % 2 === 0 ? mats.granite : mats.sandstoneDark;

    // Back, left, right hollow structural walls
    addBox(vimanaCore, width, h, thickness, 0, y, vimanaCenterZ - width / 2 + thickness / 2, mat);
    addBox(vimanaCore, thickness, h, width, -width / 2 + thickness / 2, y, vimanaCenterZ, mat);
    addBox(vimanaCore, thickness, h, width, width / 2 - thickness / 2, y, vimanaCenterZ, mat);

    // Carved cornice cap & miniature corner Kuta dormers on sides/back
    addBox(vimanaCore, width + 0.1, 0.06, thickness + 0.08, 0, y + 0.13, vimanaCenterZ - width / 2 + thickness / 2, mats.carvedRelief);
    addBox(vimanaCore, thickness + 0.08, 0.06, width + 0.1, -width / 2 + thickness / 2, y + 0.13, vimanaCenterZ, mats.carvedRelief);
    addBox(vimanaCore, thickness + 0.08, 0.06, width + 0.1, width / 2 - thickness / 2, y + 0.13, vimanaCenterZ, mats.carvedRelief);

    if (i < 11) {
      const kutaSize = Math.max(0.14, 0.24 - t * 0.1);
      for (const kx of [-width / 2 + 0.06, 0, width / 2 - 0.06]) {
        addBox(vimanaCore, kutaSize, 0.18, kutaSize, kx, y + 0.16, vimanaCenterZ - width / 2 + 0.06, mats.sandstone);
      }
      for (const kz of [vimanaCenterZ - width / 2 + 0.06, vimanaCenterZ, vimanaCenterZ + width / 2 - 0.06]) {
        addBox(vimanaCore, kutaSize, 0.18, kutaSize, -width / 2 + 0.06, y + 0.16, kz, mats.sandstone);
        addBox(vimanaCore, kutaSize, 0.18, kutaSize, width / 2 - 0.06, y + 0.16, kz, mats.sandstone);
      }
    }

    // Front wall slice (hidden in Cutaway)
    addBox(vimanaOuterFront, width, h, thickness, 0, y, vimanaCenterZ + width / 2 - thickness / 2, mat);
    addBox(
      vimanaOuterFront,
      width + 0.1,
      0.06,
      thickness + 0.08,
      0,
      y + 0.13,
      vimanaCenterZ + width / 2 - thickness / 2,
      mats.carvedRelief
    );
    if (i < 11) {
      const kutaSize = Math.max(0.14, 0.24 - t * 0.1);
      addBox(vimanaOuterFront, kutaSize * 1.4, 0.18, kutaSize, 0, y + 0.16, vimanaCenterZ + width / 2 - 0.06, mats.sandstone);
    }
  }

  // Sculpted Octagonal Griva + 80-Ton LatheGeometry Kumbam Cupola + Golden Kalasa
  const apexGroup = new THREE.Group();
  apexGroup.position.set(0, 4.18, vimanaCenterZ);
  addCyl(apexGroup, 0.52, 0.58, 0.28, 8, 0, 0.14, 0, mats.granite);
  const kumbamPts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.62, 0),
    new THREE.Vector2(0.68, 0.14),
    new THREE.Vector2(0.56, 0.34),
    new THREE.Vector2(0.32, 0.52),
    new THREE.Vector2(0.14, 0.62),
    new THREE.Vector2(0.01, 0.62),
  ];
  const kumbam = new THREE.Mesh(new THREE.LatheGeometry(kumbamPts, 8), mats.sandstone);
  kumbam.position.y = 0.28;
  kumbam.castShadow = true;
  apexGroup.add(kumbam);
  addAmalakaFinial(apexGroup, 0, 0.88, 0, 0.72, mats.sandstoneDark, mats.goldBrass);
  group.add(apexGroup);

  // Inclined Earthen Ramp Mechanics (Animated Mode)
  const rampGroup = new THREE.Group();
  rampGroup.visible = false;
  const rampGeo = new THREE.BoxGeometry(0.95, 0.24, 6.4);
  const rampMesh = new THREE.Mesh(rampGeo, mats.terracotta);
  rampMesh.position.set(-2.35, 2.35, 0.85);
  rampMesh.rotation.x = -0.68;
  rampGroup.add(rampMesh);
  const sledStone = addBox(rampGroup, 0.56, 0.36, 0.56, -2.35, 1.0, 2.8, mats.granite);
  group.add(rampGroup);

  return {
    group,
    setMode(mode) {
      vimanaOuterFront.visible = mode !== 'cutaway';
      rampGroup.visible = mode === 'animated';
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        const cycle = (elapsed * 0.28) % 1;
        sledStone.position.z = 3.1 - cycle * 4.8;
        sledStone.position.y = 0.65 + cycle * 3.85;
        return true;
      }
      return false;
    },
  };
}

// 3. AJANTA CAVES (Sculpted Deccan Basalt Gorge Cliff & Vaulted Chaitya Hall)
function buildAjantaCaves(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.85);

  // Rock-cut stepped floor platform
  addBox(group, 6.2, 0.22, 5.2, 0, 0.14, 0, mats.basalt);

  const interior = new THREE.Group();
  group.add(interior);

  // Carved Apsidal Chaitya Columns with Pot Capitals
  for (let i = 0; i < 6; i++) {
    const z = 1.4 - i * 0.56;
    addLatheColumn(interior, 1.78, 0.095, mats.basalt, mats.sandstoneDark).position.set(-0.95, 0.25, z);
    addLatheColumn(interior, 1.78, 0.095, mats.basalt, mats.sandstoneDark).position.set(0.95, 0.25, z);
  }
  for (let a = 0; a <= 4; a++) {
    const ang = (a / 4) * Math.PI;
    addLatheColumn(interior, 1.78, 0.095, mats.basalt, mats.sandstoneDark).position.set(
      Math.cos(ang) * 0.95,
      0.25,
      -1.6 - Math.sin(ang) * 0.95
    );
  }

  // LatheGeometry Rock-Cut Stupa + Harmika Railing + Chhatravali Spire
  const stupaGroup = new THREE.Group();
  stupaGroup.position.set(0, 0.25, -1.45);
  const stupaPts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.64, 0),
    new THREE.Vector2(0.62, 0.68),
    new THREE.Vector2(0.58, 0.72),
    new THREE.Vector2(0.52, 0.95),
    new THREE.Vector2(0.36, 1.15),
    new THREE.Vector2(0.15, 1.25),
    new THREE.Vector2(0.01, 1.27),
  ];
  const stupaMesh = new THREE.Mesh(new THREE.LatheGeometry(stupaPts, 24), mats.sandstoneDark);
  stupaMesh.castShadow = true;
  stupaGroup.add(stupaMesh);
  addBox(stupaGroup, 0.34, 0.22, 0.34, 0, 1.38, 0, mats.goldBrass);
  addCyl(stupaGroup, 0.22, 0.22, 0.05, 16, 0, 1.62, 0, mats.goldBrass);
  addCyl(stupaGroup, 0.15, 0.15, 0.05, 16, 0, 1.72, 0, mats.goldBrass);
  interior.add(stupaGroup);

  // Detailed Mineral Pigment Fresco Mural Panels on Side Aisle Walls
  const leftMural = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.55), mats.frescoOchre);
  leftMural.rotation.y = Math.PI / 2;
  leftMural.position.set(-1.84, 1.15, 0);
  const rightMural = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.55), mats.frescoLapis);
  rightMural.rotation.y = -Math.PI / 2;
  rightMural.position.set(1.84, 1.15, 0);
  interior.add(leftMural, rightMural);

  // Vaulted Chaitya Timber-Style Stone Ribs
  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.06, 8, 22, Math.PI), mats.sandstoneDark);
    rib.position.set(0, 2.02, 1.4 - i * 0.56);
    interior.add(rib);
  }

  // Sculpted Horseshoe Gavaksha Arch Facade (ExtrudeGeometry)
  const archShape = new THREE.Shape();
  archShape.moveTo(-2.55, 0);
  archShape.lineTo(-2.55, 3.15);
  archShape.lineTo(2.55, 3.15);
  archShape.lineTo(2.55, 0);
  archShape.lineTo(0.95, 0);
  archShape.lineTo(0.95, 1.85);
  archShape.absarc(0, 1.85, 0.95, 0, Math.PI, false);
  archShape.lineTo(-0.95, 0);
  archShape.closePath();

  const facadeGeo = new THREE.ExtrudeGeometry(archShape, {
    depth: 0.36,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  const facadeMesh = new THREE.Mesh(facadeGeo, mats.basalt);
  facadeMesh.position.set(0, 0.25, 1.75);
  facadeMesh.castShadow = true;
  facadeMesh.receiveShadow = true;
  group.add(facadeMesh);

  // Carved Horseshoe Gavaksha Sun-Window Frame & Finial
  const gavakshaArch = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.16, 10, 28, Math.PI * 1.12),
    mats.carvedRelief
  );
  gavakshaArch.rotation.z = -Math.PI * 0.06;
  gavakshaArch.position.set(0, 2.15, 2.15);
  group.add(gavakshaArch);
  addAmalakaFinial(group, 0, 3.22, 2.12, 0.4, mats.sandstoneDark, mats.goldBrass);

  // Stratified Natural Basalt Cliff Rock Mass (stepped ledges instead of one flat box!)
  const cliffShell = new THREE.Group();
  // Back mountain cliff strata
  addBox(cliffShell, 5.8, 3.4, 0.78, 0, 1.9, -2.55, mats.basalt);
  addBox(cliffShell, 5.2, 0.75, 0.9, 0, 3.65, -2.4, mats.basalt);
  addBox(cliffShell, 4.4, 0.55, 1.2, -0.3, 4.1, -2.15, mats.mossStone);

  // Side cliff walls with stepped natural rock overhangs
  const leftCliffWall = addBox(cliffShell, 0.85, 3.3, 4.6, -2.35, 1.85, -0.25, mats.basalt);
  const rightCliffWall = addBox(cliffShell, 0.85, 3.3, 4.6, 2.35, 1.85, -0.25, mats.basalt);
  const cliffRoof = new THREE.Group();
  addBox(cliffRoof, 5.6, 0.65, 4.6, 0, 3.45, -0.25, mats.basalt);
  addBox(cliffRoof, 4.8, 0.42, 3.8, 0.1, 3.92, -0.45, mats.mossStone);
  cliffShell.add(cliffRoof);

  // Natural mossy rock boulders flanking the cave entrance
  const rockMat = mats.basalt;
  for (const [rx, ry, rz, rs] of [
    [-2.7, 0.6, 1.6, 0.55],
    [2.7, 0.65, 1.5, 0.6],
    [-2.5, 2.6, 1.8, 0.48],
    [2.5, 2.7, 1.75, 0.5],
  ]) {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 1), rockMat);
    boulder.position.set(rx, ry, rz);
    boulder.castShadow = true;
    cliffShell.add(boulder);
  }
  group.add(cliffShell);

  // Solar Mirror Light Beam (Animated Mode)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffd578,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const solarBeam = new THREE.Mesh(new THREE.ConeGeometry(1.15, 4.2, 20, 1, true), beamMat);
  solarBeam.rotation.x = Math.PI / 2.4;
  solarBeam.position.set(0, 1.75, 0.25);
  solarBeam.visible = false;
  group.add(solarBeam);

  return {
    group,
    setMode(mode) {
      const cut = mode === 'cutaway';
      cliffRoof.visible = !cut;
      leftCliffWall.visible = !cut;
      rightCliffWall.visible = !cut;
      solarBeam.visible = mode === 'animated';
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        beamMat.opacity = 0.22 + Math.sin(elapsed * 2.2) * 0.1;
        solarBeam.rotation.z = Math.sin(elapsed * 0.9) * 0.14;
        return true;
      }
      return false;
    },
  };
}

// 4. GOL GUMBAZ (Adil Shahi Arcaded Facade, Bracketed Chhajja, Kangura Parapet & Lotus Dome)
function buildGolGumbaz(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.9);

  // Broad Basalt Stepped Terrace Plinth
  addBox(group, 5.5, 0.28, 5.5, 0, 0.16, 0, mats.basalt);
  addBox(group, 5.1, 0.16, 5.1, 0, 0.36, 0, mats.sandstoneDark);

  const fullWalls = new THREE.Group();
  const cutWalls = new THREE.Group();
  group.add(fullWalls, cutWalls);

  // Build authentic Bijapur wall with 3 recessed pointed arches + overhanging chhajja cornice + merlons
  const buildArcadedFacade = (
    parent: THREE.Object3D,
    x: number,
    z: number,
    rotY: number
  ) => {
    const wall = new THREE.Group();
    wall.position.set(x, 0.44, z);
    wall.rotation.y = rotY;

    // Extruded triple-arch wall body
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-2.0, 0);
    wallShape.lineTo(-2.0, 2.38);
    wallShape.lineTo(2.0, 2.38);
    wallShape.lineTo(2.0, 0);
    wallShape.closePath();

    // Central arched doorway cutout
    const door = new THREE.Path();
    door.moveTo(-0.38, 0);
    door.lineTo(-0.38, 0.95);
    door.quadraticCurveTo(-0.35, 1.38, 0, 1.56);
    door.quadraticCurveTo(0.35, 1.38, 0.38, 0.95);
    door.lineTo(0.38, 0);
    door.closePath();
    wallShape.holes.push(door);

    const wallGeo = new THREE.ExtrudeGeometry(wallShape, { depth: 0.34, bevelEnabled: false });
    wallGeo.translate(0, 0, -0.17);
    const wallMesh = new THREE.Mesh(wallGeo, mats.sandstoneDark);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wall.add(wallMesh);

    // Side recessed blind arch panels + brass jali windows
    for (const ax of [-1.2, 1.2]) {
      addBox(wall, 0.85, 1.65, 0.08, ax, 1.05, 0.16, mats.basalt);
      addBox(wall, 0.72, 1.48, 0.05, ax, 1.05, 0.19, mats.sandstone);
    }

    // Projecting Chhajja Cornice Brackets & Kangura Merlon Parapet
    addBox(wall, 4.25, 0.12, 0.56, 0, 2.34, 0.08, mats.carvedRelief);
    for (let m = -4; m <= 4; m++) {
      addCyl(wall, 0.07, 0.11, 0.2, 6, m * 0.44, 2.52, 0.12, mats.limestone);
    }

    parent.add(wall);
  };

  buildArcadedFacade(fullWalls, 0, -1.86, Math.PI);
  buildArcadedFacade(fullWalls, -1.86, 0, -Math.PI / 2);
  buildArcadedFacade(cutWalls, 0, 1.86, 0);
  buildArcadedFacade(cutWalls, 1.86, 0, Math.PI / 2);

  // 4 Octagonal 7-Storey Corner Towers with Bracketed Balconies & Bulbous Domes
  const towerPositions: [number, number][] = [
    [-2.15, -2.15],
    [2.15, -2.15],
    [-2.15, 2.15],
    [2.15, 2.15],
  ];
  towerPositions.forEach(([tx, tz], idx) => {
    const tower = new THREE.Group();
    addCyl(tower, 0.34, 0.39, 2.95, 8, tx, 1.9, tz, mats.sandstone);
    for (let ring = 0; ring < 5; ring++) {
      addCyl(tower, 0.44, 0.4, 0.08, 8, tx, 0.82 + ring * 0.54, tz, mats.basalt);
    }
    // Lotus-necked bulbous corner dome
    addCyl(tower, 0.36, 0.34, 0.12, 12, tx, 3.4, tz, mats.carvedRelief);
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
      mats.limestone
    );
    cap.position.set(tx, 3.48, tz);
    tower.add(cap);
    addCyl(tower, 0.01, 0.04, 0.24, 8, tx, 3.92, tz, mats.goldBrass);
    if (idx === 3) cutWalls.add(tower);
    else fullWalls.add(tower);
  });

  // 8 Intersecting Pendentive Arches + Circular Whispering Gallery Walkway
  const galleryRing = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.14, 10, 36), mats.limestone);
  galleryRing.rotation.x = Math.PI / 2;
  galleryRing.position.y = 2.68;
  group.add(galleryRing);

  for (let i = 0; i < 4; i++) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.075, 8, 24, Math.PI), mats.sandstone);
    arch.rotation.y = (i * Math.PI) / 4;
    arch.position.y = 1.42;
    group.add(arch);
  }

  // Interior Raised Dais & Cenotaphs
  addBox(group, 1.25, 0.18, 1.55, 0, 0.52, 0, mats.sandstoneDark);
  addBox(group, 0.48, 0.24, 0.92, 0, 0.72, 0, mats.basalt);

  // Carved Lotus-Petal Drum Ring at Dome Base
  addCyl(group, 1.92, 1.96, 0.22, 32, 0, 2.82, 0, mats.carvedRelief);

  // Hemispherical Dome (Full vs Cutaway 270 deg)
  const domeFull = new THREE.Mesh(
    new THREE.SphereGeometry(1.88, 36, 22, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.limestone
  );
  domeFull.position.y = 2.9;
  domeFull.castShadow = true;
  group.add(domeFull);

  const domeCut = new THREE.Mesh(
    new THREE.SphereGeometry(1.88, 28, 18, Math.PI * 0.5, Math.PI * 1.5, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0xc7bda9,
      roughness: 0.72,
      side: THREE.DoubleSide,
    })
  );
  domeCut.position.y = 2.9;
  domeCut.visible = false;
  group.add(domeCut);

  // Golden Finial atop Dome
  addCyl(group, 0.025, 0.11, 0.58, 12, 0, 5.0, 0, mats.goldBrass);

  // Acoustic Sound-Wave Rings (Animated Mode)
  const waveMat = new THREE.MeshBasicMaterial({
    color: 0xe6b447,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });
  const soundRings: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.26, 24), waveMat.clone());
    ring.visible = false;
    group.add(ring);
    soundRings.push(ring);
  }

  return {
    group,
    setMode(mode) {
      const showInside = mode === 'cutaway' || mode === 'animated';
      cutWalls.visible = !showInside;
      domeFull.visible = !showInside;
      domeCut.visible = showInside;
      soundRings.forEach((r) => {
        r.visible = mode === 'animated';
      });
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        soundRings.forEach((ring, idx) => {
          const phase = (elapsed * 0.75 + idx * 0.25) % 1;
          const angle = -Math.PI + phase * Math.PI;
          const rad = 1.52;
          ring.position.set(
            Math.cos(angle) * rad,
            2.75 + Math.sin(phase * Math.PI) * 0.45,
            Math.sin(angle) * rad * 0.65
          );
          const scale = 0.6 + Math.sin(phase * Math.PI) * 1.3;
          ring.scale.setScalar(scale);
          ring.lookAt(0, 2.75, 0);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - Math.abs(phase - 0.5) * 1.5);
        });
        return true;
      }
      return false;
    },
  };
}

// 5. MARTAND SUN TEMPLE (Kashmiri Limestone Peristyle, Trefoil Pediments & Pyramidal Roof)
function buildMartandSun(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.9);

  // Karewa Plateau Molded Limestone Plinth
  addBox(group, 6.0, 0.28, 6.8, 0, 0.16, 0, mats.limestone);
  addBox(group, 5.7, 0.14, 6.5, 0, 0.36, 0, mats.carvedRelief);

  const ruinsGroup = new THREE.Group();
  group.add(ruinsGroup);

  // Central Sanctum Molded Base & Surviving Ashlar Walls with Trefoil Pediment Relief
  addBox(ruinsGroup, 2.15, 0.3, 2.35, 0, 0.58, -0.05, mats.sandstoneDark);
  addBox(ruinsGroup, 1.8, 1.45, 0.26, 0, 1.4, -0.95, mats.limestone);
  addBox(ruinsGroup, 0.26, 1.45, 2.0, -0.82, 1.4, -0.05, mats.limestone);
  addBox(ruinsGroup, 0.26, 1.45, 2.0, 0.82, 1.4, -0.05, mats.limestone);

  // Kashmiri Trefoil Arch Niche Helper
  const addTrefoilPortal = (parent: THREE.Object3D, x: number, y: number, z: number, scale = 1) => {
    const p = new THREE.Group();
    p.position.set(x, y, z);
    p.scale.setScalar(scale);
    addBox(p, 0.52, 1.65, 0.58, -0.68, 0.82, 0, mats.limestone);
    addBox(p, 0.52, 1.65, 0.58, 0.68, 0.82, 0, mats.limestone);
    const trefoil = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.12, 8, 18, Math.PI), mats.carvedRelief);
    trefoil.position.set(0, 1.25, 0);
    p.add(trefoil);
    // Triangular pediment gable arms
    const gableL = addBox(p, 0.95, 0.16, 0.62, -0.4, 1.75, 0, mats.limestone);
    gableL.rotation.z = 0.58;
    const gableR = addBox(p, 0.95, 0.16, 0.62, 0.4, 1.75, 0, mats.limestone);
    gableR.rotation.z = -0.58;
    parent.add(p);
  };

  // Western Monumental Entrance Gateway Ruins
  addTrefoilPortal(ruinsGroup, 0, 0.43, 2.75, 1.0);

  // Fluted Kashmiri Peristyle Colonnade Pillars around Courtyard
  for (let i = -3; i <= 3; i++) {
    if (i !== 0) {
      addLatheColumn(ruinsGroup, 1.32, 0.11, mats.limestone, mats.sandstoneDark).position.set(
        i * 0.82,
        0.43,
        -2.75
      );
    }
  }
  for (let z = -2; z <= 2; z++) {
    addLatheColumn(ruinsGroup, 1.32, 0.11, mats.limestone, mats.sandstoneDark).position.set(
      -2.5,
      0.43,
      z * 0.95
    );
    addLatheColumn(ruinsGroup, 1.32, 0.11, mats.limestone, mats.sandstoneDark).position.set(
      2.5,
      0.43,
      z * 0.95
    );
  }

  // Scholarly 3D Reconstruction Overlay (Two-Tiered Pyramidal Kashmiri Roof & Peristyle Lintels)
  const reconGroup = new THREE.Group();
  reconGroup.visible = false;
  group.add(reconGroup);

  const reconMat = new THREE.MeshStandardMaterial({
    color: 0xe6d4af,
    roughness: 0.6,
    metalness: 0.08,
    transparent: true,
    opacity: 0.92,
  });

  const pyr1 = new THREE.Mesh(new THREE.ConeGeometry(1.62, 1.25, 4), reconMat);
  pyr1.rotation.y = Math.PI / 4;
  pyr1.position.set(0, 2.72, -0.05);
  reconGroup.add(pyr1);

  const pyr2 = new THREE.Mesh(new THREE.ConeGeometry(1.08, 1.2, 4), reconMat);
  pyr2.rotation.y = Math.PI / 4;
  pyr2.position.set(0, 3.55, -0.05);
  reconGroup.add(pyr2);
  addAmalakaFinial(reconGroup, 0, 4.1, -0.05, 0.52, mats.limestone, mats.goldBrass);

  const gateRoof = new THREE.Mesh(new THREE.ConeGeometry(1.18, 0.98, 4), reconMat);
  gateRoof.rotation.y = Math.PI / 4;
  gateRoof.position.set(0, 2.72, 2.75);
  reconGroup.add(gateRoof);

  addBox(reconGroup, 5.4, 0.22, 0.48, 0, 1.85, -2.75, reconMat);
  addBox(reconGroup, 0.48, 0.22, 5.7, -2.5, 1.85, 0, reconMat);
  addBox(reconGroup, 0.48, 0.22, 5.7, 2.5, 1.85, 0, reconMat);

  return {
    group,
    setMode(mode) {
      reconGroup.visible = mode === 'reconstruction';
      ruinsGroup.children[1].visible = mode !== 'cutaway';
    },
    update() {
      return false;
    },
  };
}

// 6. KAILASA TEMPLE, ELLORA (Stratified Basalt Quarry Trench, Cloister Caves, Elephant Plinth)
function buildKailasaEllora(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.9);

  // Monolithic Basalt Courtyard Floor
  addBox(group, 5.4, 0.18, 5.6, 0, 0.11, -0.1, mats.basalt);

  // Stratified U-Shaped Quarry Cliff Walls with Carved Side Gallery Cloisters
  const backCliff = new THREE.Group();
  addBox(backCliff, 6.2, 3.5, 0.78, 0, 1.85, -2.85, mats.basalt);
  addBox(backCliff, 5.8, 0.45, 0.9, 0, 3.7, -2.78, mats.mossStone);
  group.add(backCliff);

  const leftCliff = new THREE.Group();
  addBox(leftCliff, 0.78, 3.5, 5.8, -2.85, 1.85, -0.25, mats.basalt);
  addBox(leftCliff, 0.9, 0.45, 5.4, -2.78, 3.7, -0.25, mats.mossStone);
  // Carved rock-cut side gallery colonnade pillars along left cliff wall
  for (let c = -2; c <= 2; c++) {
    addLatheColumn(leftCliff, 1.15, 0.08, mats.sandstoneDark, mats.basalt).position.set(-2.35, 0.22, c * 0.9);
  }
  group.add(leftCliff);

  const rightCliff = new THREE.Group();
  addBox(rightCliff, 0.78, 3.5, 5.8, 2.85, 1.85, -0.25, mats.basalt);
  addBox(rightCliff, 0.9, 0.45, 5.4, 2.78, 3.7, -0.25, mats.mossStone);
  for (let c = -2; c <= 2; c++) {
    addLatheColumn(rightCliff, 1.15, 0.08, mats.sandstoneDark, mats.basalt).position.set(2.35, 0.22, c * 0.9);
  }
  group.add(rightCliff);

  // Sculpted Elephant-Caryatid Plinth Base
  addBox(group, 2.55, 0.56, 3.15, 0, 0.48, -0.45, mats.sandstoneDark);
  addBox(group, 2.72, 0.1, 3.3, 0, 0.8, -0.45, mats.carvedRelief);
  for (let i = -2; i <= 2; i++) {
    for (const side of [-1, 1]) {
      const el = new THREE.Group();
      el.position.set(side * 1.32, 0.22, -0.45 + i * 0.54);
      addBox(el, 0.34, 0.28, 0.28, 0, 0.14, 0, mats.basalt);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), mats.basalt);
      head.position.set(side * 0.16, 0.22, 0);
      const trunk = addCyl(el, 0.035, 0.025, 0.22, 6, side * 0.24, 0.1, 0, mats.basalt);
      trunk.rotation.z = side * -0.25;
      el.add(head);
      group.add(el);
    }
  }

  // Main Mandapa Hall & Carved Dravidian Shikhara Tower
  addBox(group, 2.15, 1.12, 1.85, 0, 1.4, 0.12, mats.sandstoneDark);
  addBox(group, 2.34, 0.12, 2.02, 0, 2.0, 0.12, mats.carvedRelief);
  for (let t = 0; t < 6; t++) {
    const w = 1.75 - t * 0.24;
    const y = 1.56 + t * 0.34;
    addBox(group, w, 0.26, w, 0, y, -1.18, t % 2 === 0 ? mats.sandstoneDark : mats.sandstone);
    addBox(group, w + 0.08, 0.06, w + 0.08, 0, y + 0.14, -1.18, mats.carvedRelief);
  }
  addAmalakaFinial(group, 0, 3.65, -1.18, 0.6, mats.sandstoneDark, mats.goldBrass);

  // Twin Freestanding Monolithic Dhvajastambha Pillars
  for (const px of [-1.48, 1.48]) {
    addLatheColumn(group, 2.1, 0.16, mats.sandstoneDark, mats.basalt, mats.goldBrass).position.set(px, 0.2, 1.45);
    addCyl(group, 0.03, 0.08, 0.26, 8, px, 2.42, 1.45, mats.goldBrass);
  }

  // Nandi Shrine & Carved Flying Stone Bridge
  addBox(group, 1.12, 0.96, 1.02, 0, 0.68, 1.82, mats.sandstoneDark);
  addBox(group, 1.24, 0.1, 1.14, 0, 1.2, 1.82, mats.carvedRelief);
  addAmalakaFinial(group, 0, 1.26, 1.82, 0.36, mats.sandstone, mats.goldBrass);
  addBox(group, 0.64, 0.14, 0.88, 0, 1.18, 1.15, mats.carvedRelief);

  // Uncut Overburden Basalt Mass (Top-Down Excavation Animation)
  const overburdenMat = new THREE.MeshStandardMaterial({
    color: 0x6b5a50,
    roughness: 0.9,
    transparent: true,
    opacity: 0.6,
  });
  const overburden = new THREE.Mesh(new THREE.BoxGeometry(4.75, 3.4, 4.95), overburdenMat);
  overburden.position.set(0, 1.9, -0.15);
  overburden.visible = false;
  group.add(overburden);

  return {
    group,
    setMode(mode) {
      rightCliff.visible = mode !== 'cutaway';
      overburden.visible = mode === 'animated';
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        const prog = (elapsed * 0.22) % 1;
        const remaining = Math.max(0.04, 1 - prog);
        overburden.scale.y = remaining;
        overburden.position.y = 0.2 + (3.4 * remaining) / 2;
        return true;
      }
      return false;
    },
  };
}

// 7. KONARK SUN TEMPLE (Kalinga Pidha Deul, Carved 24-Spoke Wheels, Sculpted Horses)
function buildKonarkSun(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.9);

  // Molded Ratha Chariot Platform (Pitha) with Carved Friezes
  addBox(group, 4.75, 0.24, 3.35, -0.35, 0.16, 0, mats.basalt);
  addBox(group, 4.58, 0.56, 3.16, -0.35, 0.56, 0, mats.sandstoneDark);
  addBox(group, 4.72, 0.14, 3.3, -0.35, 0.9, 0, mats.carvedRelief);

  const jagaShell = new THREE.Group();
  const jagaIronBeams = new THREE.Group();
  jagaIronBeams.visible = false; // Only revealed cleanly in Cutaway mode!
  group.add(jagaIronBeams, jagaShell);

  // Internal Forged Wrought-Iron Lintel Beams (Cutaway reveal)
  for (let b = -1; b <= 1; b++) {
    addBox(jagaIronBeams, 2.3, 0.16, 0.2, -0.5, 1.88, b * 0.72, mats.softIron);
  }
  addBox(jagaIronBeams, 0.24, 1.2, 1.8, -1.5, 1.38, 0, mats.sandstoneDark);
  addBox(jagaIronBeams, 0.24, 1.2, 1.8, 0.5, 1.38, 0, mats.sandstoneDark);

  // Authentic 3-Cluster Stepped Pidha Deul Jagamohana Roof
  const tierGroups = [
    { count: 4, baseW: 2.85, baseY: 1.06, stepW: 0.18, stepH: 0.16 },
    { count: 4, baseW: 2.05, baseY: 1.76, stepW: 0.16, stepH: 0.15 },
    { count: 3, baseW: 1.32, baseY: 2.42, stepW: 0.14, stepH: 0.14 },
  ];
  tierGroups.forEach((cluster) => {
    for (let i = 0; i < cluster.count; i++) {
      const w = cluster.baseW - i * cluster.stepW;
      const y = cluster.baseY + i * cluster.stepH;
      addBox(jagaShell, w, cluster.stepH * 0.85, w, -0.5, y, 0, i % 2 === 0 ? mats.sandstone : mats.carvedRelief);
    }
  });
  // Crowning Bell (Ghanta), Ribbed Amalaka & Kalasa Finial
  addCyl(jagaShell, 0.34, 0.52, 0.32, 16, -0.5, 2.98, 0, mats.terracotta);
  addAmalakaFinial(jagaShell, -0.5, 3.16, 0, 0.72, mats.sandstone, mats.goldBrass);

  // Detailed 24-Spoke Carved Konark Solar Chariot Wheel
  const buildWheel = (scale = 1) => {
    const wheel = new THREE.Group();
    const outerRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.76 * scale, 0.085 * scale, 12, 36),
      mats.sandstone
    );
    const beadedRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.66 * scale, 0.032 * scale, 8, 36),
      mats.carvedRelief
    );
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32 * scale, 0.03 * scale, 8, 24),
      mats.sandstoneDark
    );
    wheel.add(outerRim, beadedRing, innerRing);

    const hub = addCyl(wheel, 0.16 * scale, 0.22 * scale, 0.5 * scale, 16, 0, 0, 0, mats.goldBrass);
    hub.rotation.x = Math.PI / 2;

    // 8 Major Carved Spokes + 8 Minor Spoke Medallions
    for (let s = 0; s < 16; s++) {
      const isMajor = s % 2 === 0;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry((isMajor ? 0.075 : 0.035) * scale, 1.44 * scale, (isMajor ? 0.065 : 0.04) * scale),
        isMajor ? mats.sandstoneDark : mats.carvedRelief
      );
      spoke.rotation.z = (s * Math.PI) / 16;
      wheel.add(spoke);
    }
    return wheel;
  };

  const heroWheel = buildWheel(1.06);
  heroWheel.position.set(0.35, 0.88, 1.72);
  group.add(heroWheel);

  const rearWheel = buildWheel(0.95);
  rearWheel.position.set(-1.55, 0.82, 1.72);
  group.add(rearWheel);

  const backWheel1 = buildWheel(0.95);
  backWheel1.position.set(0.35, 0.82, -1.72);
  group.add(backWheel1);

  const backWheel2 = buildWheel(0.95);
  backWheel2.position.set(-1.55, 0.82, -1.72);
  group.add(backWheel2);

  // 7 Sculpted Prancing Stone Horses at Eastern Staircase (ExtrudeGeometry silhouette)
  const horseShape = new THREE.Shape();
  horseShape.moveTo(-0.34, 0);
  horseShape.lineTo(-0.34, 0.28);
  horseShape.quadraticCurveTo(-0.1, 0.36, 0.14, 0.32);
  horseShape.quadraticCurveTo(0.26, 0.54, 0.34, 0.66); // arched neck
  horseShape.lineTo(0.46, 0.58); // head & snout
  horseShape.lineTo(0.38, 0.44);
  horseShape.quadraticCurveTo(0.28, 0.32, 0.22, 0.14);
  horseShape.lineTo(0.36, 0.24); // rearing foreleg
  horseShape.lineTo(0.32, 0.04);
  horseShape.lineTo(0.14, 0.06);
  horseShape.lineTo(-0.24, 0);
  horseShape.closePath();

  const horseGeo = new THREE.ExtrudeGeometry(horseShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
  });
  horseGeo.translate(0, 0, -0.07);

  for (let h = -3; h <= 3; h++) {
    const horseZ = h * 0.36;
    const horse = new THREE.Mesh(horseGeo, h % 2 === 0 ? mats.sandstone : mats.sandstoneDark);
    horse.position.set(2.45, 0.26, horseZ);
    horse.castShadow = true;
    horse.receiveShadow = true;
    group.add(horse);
    // Hind legs grounded to pedestal
    addCyl(group, 0.032, 0.028, 0.3, 6, 2.22, 0.18, horseZ, mats.sandstoneDark);
  }

  // Solar Sundial Shadow Ray Indicator (Animated Mode)
  const sunRay = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.55, 8),
    new THREE.MeshBasicMaterial({ color: 0xf7c954 })
  );
  sunRay.position.set(0.35, 0.88, 2.02);
  sunRay.visible = false;
  group.add(sunRay);

  return {
    group,
    setMode(mode) {
      const isCut = mode === 'cutaway';
      jagaShell.visible = !isCut;
      jagaIronBeams.visible = isCut;
      sunRay.visible = mode === 'animated';
    },
    update(dt, elapsed, mode) {
      if (mode === 'animated') {
        heroWheel.rotation.z -= dt * 0.45;
        rearWheel.rotation.z -= dt * 0.45;
        sunRay.rotation.z = Math.sin(elapsed * 0.7) * 1.1;
        return true;
      }
      return false;
    },
  };
}

// 8. LIVING ROOT BRIDGES (Meghalaya Rainforest Gorge & Interwoven Aerial Roots)
function buildLivingRootBridge(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.85);

  // Mossy River Gorge Banks & Boulder Outcrops
  addBox(group, 2.25, 1.52, 4.8, -2.55, 0.78, 0, mats.mossStone);
  addBox(group, 2.25, 1.52, 4.8, 2.55, 0.78, 0, mats.mossStone);
  const stream = addBox(group, 3.4, 0.26, 4.8, 0, 0.15, 0, mats.water, false);

  // Gorge river boulders
  for (const [bx, bz, bs] of [
    [-1.1, 1.4, 0.35],
    [1.0, -1.2, 0.4],
    [-0.9, -1.6, 0.28],
    [1.15, 0.8, 0.32],
  ]) {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(bs, 1), mats.basalt);
    boulder.position.set(bx, 0.25, bz);
    group.add(boulder);
  }

  // Living Ficus Elastica Parent Trees with Twisted Buttresses
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x355d38, roughness: 0.86 });
  const canopyLightMat = new THREE.MeshStandardMaterial({ color: 0x4b7a48, roughness: 0.84 });
  const buildFigTree = (x: number, flip: number) => {
    const t = new THREE.Group();
    t.position.set(x, 1.52, 0);
    addCyl(t, 0.28, 0.48, 2.15, 10, 0, 1.07, 0, mats.woodBark);
    // Buttress root spurs
    for (let b = 0; b < 3; b++) {
      const spur = addCyl(t, 0.08, 0.14, 1.1, 6, Math.cos(b * 2.1) * 0.3, 0.45, Math.sin(b * 2.1) * 0.3, mats.woodBark);
      spur.rotation.z = Math.cos(b * 2.1) * 0.35;
    }
    const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.18, 1), canopyMat);
    c1.position.set(flip * 0.2, 2.25, 0);
    const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.88, 1), canopyLightMat);
    c2.position.set(-flip * 0.5, 1.95, 0.48);
    const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), canopyMat);
    c3.position.set(flip * 0.4, 1.85, -0.55);
    t.add(c1, c2, c3);
    group.add(t);
  };
  buildFigTree(-2.45, 1);
  buildFigTree(2.45, -1);

  // Interwoven Root Suspension Curves + Diagonal Lattice Handrails
  const rootStrands: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const zOffset = (i - 3.5) * 0.16;
    const isHandrail = i === 0 || i === 7;
    const sag = isHandrail ? 0.58 : 0.36;
    const yBase = isHandrail ? 2.18 : 1.54;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, yBase, zOffset),
      new THREE.Vector3(-1.1, yBase - sag * 0.75, zOffset * 0.85),
      new THREE.Vector3(0, yBase - sag, zOffset * 0.8),
      new THREE.Vector3(1.1, yBase - sag * 0.75, zOffset * 0.85),
      new THREE.Vector3(2.4, yBase, zOffset),
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, isHandrail ? 0.055 : 0.075, 8, false),
      mats.woodBark
    );
    tube.castShadow = true;
    group.add(tube);
    rootStrands.push(tube);
  }

  // Flat Stone Pavers inlaid along root deck
  const pavers: THREE.Mesh[] = [];
  for (let p = -5; p <= 5; p++) {
    const x = p * 0.34;
    const y = 1.26 + x * x * 0.045;
    const paver = addBox(group, 0.28, 0.07, 0.76, x, y, 0, mats.limestone);
    pavers.push(paver);
  }

  // Hollowed Betel-Nut Palm Guide Trunk (highlighted in growth animation)
  const guidePalm = addCyl(group, 0.08, 0.08, 4.4, 8, 0, 1.32, 0.56, mats.sandstone);
  guidePalm.rotation.z = Math.PI / 2;

  const soilBankFront = addBox(group, 2.25, 1.52, 0.52, -2.55, 0.78, 2.15, mats.mossStone);
  for (let r = 0; r < 5; r++) {
    addCyl(group, 0.065, 0.025, 1.3, 6, -2.35 + r * 0.22, 0.82, 1.65 - r * 0.34, mats.woodBark);
  }

  return {
    group,
    setMode(mode) {
      soilBankFront.visible = mode !== 'cutaway';
      guidePalm.visible = mode === 'animated';
      if (mode !== 'animated') {
        rootStrands.forEach((s) => s.scale.set(1, 1, 1));
        pavers.forEach((p) => {
          p.visible = true;
        });
      }
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        const cycle = (elapsed * 0.24) % 1;
        const thickness = 0.28 + cycle * 0.92;
        rootStrands.forEach((s) => s.scale.set(1, thickness, thickness));
        pavers.forEach((p, idx) => {
          p.visible = cycle > 0.32 + idx * 0.04;
        });
        stream.position.y = 0.15 + Math.sin(elapsed * 2.4) * 0.02;
        return true;
      }
      return false;
    },
  };
}

// 9. MYSOREAN IRON-CASED ROCKETS (Rosewood & Brass Ordnance Cradle)
function buildMysoreanRocket(mats: MuseumMaterialSet): BuiltExhibitModel {
  const group = new THREE.Group();
  addMuseumBase(group, mats, 3.85);

  // Rosewood & Brass Museum Display Cradle
  addBox(group, 3.8, 0.22, 1.32, 0, 0.14, 0, mats.galleryDado);
  addBox(group, 3.6, 0.08, 1.12, 0, 0.28, 0, mats.goldBrass);
  addCyl(group, 0.055, 0.085, 1.15, 12, -1.15, 0.82, 0, mats.goldBrass);
  addCyl(group, 0.055, 0.085, 1.15, 12, 0.65, 0.82, 0, mats.goldBrass);

  // Tilted Rocket Assembly
  const rocketAssembly = new THREE.Group();
  rocketAssembly.position.set(0, 1.54, 0);
  rocketAssembly.rotation.z = 0.16;
  group.add(rocketAssembly);

  // Bamboo Stabilizer Pole with Segmented Bamboo Node Rings
  const pole = addCyl(rocketAssembly, 0.055, 0.072, 4.5, 12, -1.28, -0.18, 0, mats.sandstone);
  pole.rotation.z = Math.PI / 2;
  for (let n = -3; n <= 1; n++) {
    const node = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.014, 6, 12), mats.sandstoneDark);
    node.rotation.y = Math.PI / 2;
    node.position.set(n * 0.85, -0.18, 0);
    rocketAssembly.add(node);
  }

  // Rawhide Leather Binding Straps
  for (const bx of [-0.36, 0.06, 0.48]) {
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.028, 8, 22), mats.terracotta);
    strap.rotation.y = Math.PI / 2;
    strap.position.set(bx, -0.05, 0);
    rocketAssembly.add(strap);
  }

  // Hammered Soft-Iron Cylinder (Full vs Cutaway Top Half)
  const lowerIron = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 1.48, 24, 1, false, Math.PI, Math.PI),
    mats.softIron
  );
  lowerIron.rotation.z = Math.PI / 2;
  lowerIron.position.set(0.15, 0, 0);
  rocketAssembly.add(lowerIron);

  const upperIron = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 1.48, 24, 1, false, 0, Math.PI),
    mats.softIron
  );
  upperIron.rotation.z = Math.PI / 2;
  upperIron.position.set(0.15, 0, 0);
  rocketAssembly.add(upperIron);

  // Packed Black-Powder Charge & Hollow Conical Bore (revealed in Cutaway)
  const powderCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 1.34, 20),
    mats.basalt
  );
  powderCore.rotation.z = Math.PI / 2;
  powderCore.position.set(0.15, 0, 0);
  rocketAssembly.add(powderCore);

  // Nose Cone & Double-Edged Mysorean Steel Blade
  const nose = addCyl(rocketAssembly, 0.02, 0.24, 0.38, 20, 1.08, 0, 0, mats.softIron);
  nose.rotation.z = -Math.PI / 2;
  const blade = addBox(rocketAssembly, 1.28, 0.032, 0.16, 1.78, 0, 0, mats.softIron);
  blade.rotation.x = Math.PI / 4;

  // Brass Constricted Exhaust Nozzle Collar
  const nozzle = addCyl(rocketAssembly, 0.22, 0.14, 0.22, 20, -0.68, 0, 0, mats.goldBrass);
  nozzle.rotation.z = Math.PI / 2;

  // Propulsion Exhaust Flame & Thrust Plume (Animated Mode)
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xff8c24,
    transparent: true,
    opacity: 0.9,
  });
  const flameCone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.5, 16), flameMat);
  flameCone.rotation.z = Math.PI / 2;
  flameCone.position.set(-1.48, 0, 0);
  flameCone.visible = false;
  rocketAssembly.add(flameCone);

  const innerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.98, 14),
    new THREE.MeshBasicMaterial({ color: 0xffe484 })
  );
  innerFlame.rotation.z = Math.PI / 2;
  innerFlame.position.set(-1.24, 0, 0);
  innerFlame.visible = false;
  rocketAssembly.add(innerFlame);

  return {
    group,
    setMode(mode) {
      upperIron.visible = mode !== 'cutaway';
      const isAnim = mode === 'animated';
      flameCone.visible = isAnim;
      innerFlame.visible = isAnim;
    },
    update(_dt, elapsed, mode) {
      if (mode === 'animated') {
        const pulse = 0.88 + Math.sin(elapsed * 22) * 0.18;
        flameCone.scale.set(1, pulse, 1);
        innerFlame.scale.set(1, 0.9 + Math.cos(elapsed * 28) * 0.16, 1);
        rocketAssembly.position.x = Math.sin(elapsed * 32) * 0.015;
        return true;
      }
      rocketAssembly.position.x = 0;
      return false;
    },
  };
}

export function buildExhibitModel(
  exhibitId: ExhibitId,
  mats: MuseumMaterialSet
): BuiltExhibitModel {
  switch (exhibitId) {
    case 'water-lab':
      return buildWaterLab(mats);
    case 'brihadeeswarar':
      return buildBrihadeeswarar(mats);
    case 'ajanta-caves':
      return buildAjantaCaves(mats);
    case 'gol-gumbaz':
      return buildGolGumbaz(mats);
    case 'martand-sun':
      return buildMartandSun(mats);
    case 'kailasa-ellora':
      return buildKailasaEllora(mats);
    case 'konark-sun':
      return buildKonarkSun(mats);
    case 'living-root-bridges':
      return buildLivingRootBridge(mats);
    case 'mysorean-rockets':
      return buildMysoreanRocket(mats);
    default:
      return buildWaterLab(mats);
  }
}
