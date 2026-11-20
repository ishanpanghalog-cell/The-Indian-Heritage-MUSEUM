import * as THREE from 'three';
import { ExhibitData } from '../types/museum';
import { MuseumMaterialSet } from './proceduralTextures';
import { createRadialContactShadow } from './webglUtils';

function createExhibitionPlaqueTexture(exhibit: ExhibitData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Dark bronze-umber engraved plaque with brushed brass border
  ctx.fillStyle = '#1b1410';
  ctx.fillRect(0, 0, 512, 160);

  ctx.strokeStyle = '#d8a845';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 144);
  ctx.strokeStyle = 'rgba(216, 168, 69, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 480, 128);

  // Corner brass rivets
  for (const [rx, ry] of [
    [24, 24],
    [488, 24],
    [24, 136],
    [488, 136],
  ]) {
    ctx.fillStyle = '#d8a845';
    ctx.beginPath();
    ctx.arc(rx, ry, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#d8a845';
  ctx.font = '600 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`EXHIBIT ${exhibit.number}  ·  ${exhibit.accessionNumber}`, 256, 52);

  ctx.fillStyle = '#f8f4ec';
  ctx.font = '600 30px Georgia, serif';
  const title = exhibit.shortTitle.length > 28 ? exhibit.shortTitle.slice(0, 27) + '…' : exhibit.shortTitle;
  ctx.fillText(title, 256, 94);

  ctx.fillStyle = '#cbb799';
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillText(exhibit.period, 256, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWallFolioTexture(exhibit: ExhibitData, variant: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ebe1cf';
  ctx.fillRect(0, 0, 256, 320);

  ctx.strokeStyle = '#78552b';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, 228, 292);

  // Architectural blueprint / monograph plate
  ctx.fillStyle = '#2a1e17';
  ctx.fillRect(28, 30, 200, 185);

  ctx.strokeStyle = '#d8a845';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(36, 38, 184, 169);

  // Geometric heritage motif inside frame
  ctx.save();
  ctx.translate(128, 122);
  if (variant % 2 === 0) {
    // Solar mandala / wheel geometry
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.lineTo(Math.cos(a) * 56, Math.sin(a) * 56);
      ctx.stroke();
    }
  } else {
    // Stepped elevation study
    for (let t = 0; t < 5; t++) {
      const w = 120 - t * 20;
      ctx.strokeRect(-w / 2, 46 - t * 22, w, 20);
    }
    ctx.beginPath();
    ctx.arc(0, -52, 12, Math.PI, 0);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#2a1e17';
  ctx.font = '600 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`ARCHIVE PLATE ${exhibit.number}`, 128, 248);

  ctx.fillStyle = '#594335';
  ctx.font = '11px sans-serif';
  ctx.fillText(exhibit.shortTitle.slice(0, 26), 128, 272);
  ctx.fillText(exhibit.accessionNumber, 128, 290);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface MuseumGalleryRoom {
  group: THREE.Group;
  dispose: () => void;
}

export function createMuseumGalleryEnvironment(
  scene: THREE.Scene,
  mats: MuseumMaterialSet,
  exhibit: ExhibitData,
  maxAnisotropy: number,
  onTextureReady?: () => void
): MuseumGalleryRoom {
  const group = new THREE.Group();
  scene.add(group);

  let disposed = false;
  const extraTextures: THREE.Texture[] = [];

  // Warm museum interior lighting bounce so the gallery walls & arches read clearly
  const ceilingBounce = new THREE.PointLight(0xffdfb0, 28, 36, 1.25);
  ceilingBounce.position.set(0, 8.2, 0);
  group.add(ceilingBounce);

  const backWash = new THREE.PointLight(0xffcb84, 14, 24, 1.4);
  backWash.position.set(0, 4.5, -10.5);
  group.add(backWash);

  const floorY = -0.36;

  // 1. Museum Travertine / Tile Gallery Floor
  const floor = new THREE.Mesh(new THREE.CircleGeometry(19, 48), mats.galleryFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = floorY;
  floor.receiveShadow = true;
  group.add(floor);

  // Brass floor inlay rings framing the exhibit plinth
  for (const r of [4.65, 8.4, 12.6]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.04, r + 0.04, 64), mats.goldBrass);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = floorY + 0.008;
    group.add(ring);
  }

  // 2. Central Museum Display Plinth (grounded flush on the museum floor, top at y = 0)
  const plinthShadow = createRadialContactShadow(4.8, 0.45);
  plinthShadow.position.y = floorY + 0.012;
  group.add(plinthShadow);

  const lowerStep = new THREE.Mesh(
    new THREE.CylinderGeometry(4.28, 4.42, 0.18, 48),
    mats.basalt
  );
  lowerStep.position.y = floorY + 0.09;
  lowerStep.receiveShadow = true;
  lowerStep.castShadow = true;
  group.add(lowerStep);

  const upperDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(3.96, 4.06, 0.18, 48),
    mats.sandstoneDark
  );
  upperDeck.position.y = -0.09;
  upperDeck.receiveShadow = true;
  upperDeck.castShadow = true;
  group.add(upperDeck);

  const topBrassTrim = new THREE.Mesh(
    new THREE.TorusGeometry(3.95, 0.032, 10, 64),
    mats.goldBrass
  );
  topBrassTrim.rotation.x = Math.PI / 2;
  topBrassTrim.position.y = 0.004;
  group.add(topBrassTrim);

  // Engraved Brass Exhibition Plaque at front of plinth
  const plaqueTex = createExhibitionPlaqueTexture(exhibit);
  plaqueTex.anisotropy = Math.min(8, maxAnisotropy);
  extraTextures.push(plaqueTex);

  const plaqueGroup = new THREE.Group();
  plaqueGroup.position.set(0, floorY + 0.3, 4.34);
  plaqueGroup.rotation.x = -0.45;
  const plaqueBacking = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.48, 0.06), mats.goldBrass);
  const plaqueFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.42),
    new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4, metalness: 0.15 })
  );
  plaqueFace.position.z = 0.032;
  const plaquePost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.34, 10), mats.goldBrass);
  plaquePost.position.set(0, -0.22, -0.06);
  plaquePost.rotation.x = 0.45;
  plaqueGroup.add(plaqueBacking, plaqueFace, plaquePost);
  group.add(plaqueGroup);

  // 3. Low Brass Museum Stanchions & Burgundy Velvet Ropes (r = 4.65m, h = 0.54m)
  const stanchionCount = 8;
  const stanchionR = 4.65;
  const postPoints: THREE.Vector3[] = [];
  for (let i = 0; i < stanchionCount; i++) {
    const ang = (i / stanchionCount) * Math.PI * 2 + Math.PI / 8;
    const sx = Math.cos(ang) * stanchionR;
    const sz = Math.sin(ang) * stanchionR;
    postPoints.push(new THREE.Vector3(sx, floorY + 0.48, sz));

    const postBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.05, 14), mats.goldBrass);
    postBase.position.set(sx, floorY + 0.025, sz);
    const postStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.5, 10), mats.goldBrass);
    postStem.position.set(sx, floorY + 0.28, sz);
    const postBall = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), mats.goldBrass);
    postBall.position.set(sx, floorY + 0.54, sz);
    group.add(postBase, postStem, postBall);
  }
  for (let i = 0; i < stanchionCount; i++) {
    const p1 = postPoints[i];
    const p2 = postPoints[(i + 1) % stanchionCount];
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mid.y -= 0.14;
    const ropeCurve = new THREE.CatmullRomCurve3([p1, mid, p2]);
    const rope = new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 12, 0.024, 6, false), mats.velvetRope);
    group.add(rope);
  }

  // 4. Twelve Architectural Museum Gallery Bays (Walls, Pilasters, Arched Niches, Framed Artworks)
  const wallR = 14.2;
  const wallSides = 12;
  const bayWidth = 2 * wallR * Math.tan(Math.PI / wallSides) + 0.2;

  const folioTexA = createWallFolioTexture(exhibit, 0);
  const folioTexB = createWallFolioTexture(exhibit, 1);
  extraTextures.push(folioTexA, folioTexB);
  const artMatA = new THREE.MeshStandardMaterial({ map: folioTexA, roughness: 0.55, metalness: 0.04 });
  const artMatB = new THREE.MeshStandardMaterial({ map: folioTexB, roughness: 0.55, metalness: 0.04 });

  // Load actual archival plate photo asynchronously for hero framed wall paintings
  if (exhibit.archivalImage) {
    const texLoader = new THREE.TextureLoader();
    texLoader.load(
      exhibit.archivalImage,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = Math.min(8, maxAnisotropy);
        extraTextures.push(loaded);
        artMatA.map = loaded;
        artMatA.needsUpdate = true;
        onTextureReady?.();
      },
      undefined,
      () => {
        // Keep procedural archive plate fallback
      }
    );
  }

  for (let i = 0; i < wallSides; i++) {
    const angle = (i / wallSides) * Math.PI * 2;
    const bayGroup = new THREE.Group();
    bayGroup.position.set(Math.sin(angle) * wallR, floorY, Math.cos(angle) * wallR);
    bayGroup.lookAt(0, floorY, 0);

    // Lower teak wainscoting dado
    const dado = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 1.4, 0.3), mats.galleryDado);
    dado.position.set(0, 0.7, -0.15);
    dado.receiveShadow = true;
    bayGroup.add(dado);

    // Dado chair rail molding
    const dadoRail = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 0.12, 0.38), mats.sandstoneDark);
    dadoRail.position.set(0, 1.44, -0.12);
    bayGroup.add(dadoRail);

    // Main gallery wall panel
    const wallPanel = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 7.6, 0.3), mats.galleryWall);
    wallPanel.position.set(0, 5.3, -0.15);
    wallPanel.receiveShadow = true;
    bayGroup.add(wallPanel);

    // Architectural sandstone pilaster at bay seam
    const pilasterX = bayWidth / 2;
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.55, 8.8, 0.45), mats.sandstoneDark);
    pilaster.position.set(pilasterX, 4.4, 0.05);
    bayGroup.add(pilaster);
    const pilasterCap = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.28, 0.56), mats.sandstone);
    pilasterCap.position.set(pilasterX, 8.75, 0.08);
    bayGroup.add(pilasterCap);

    // Alternating Arched Museum Alcove + Framed Exhibition Artwork
    if (i % 2 === 0) {
      const archBacking = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 4.8, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x382b22, roughness: 0.9 })
      );
      archBacking.position.set(0, 4.3, 0.02);
      bayGroup.add(archBacking);

      const archHeader = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.16, 8, 20, Math.PI),
        mats.sandstoneDark
      );
      archHeader.position.set(0, 5.4, 0.08);
      bayGroup.add(archHeader);

      // Framed Archival Artwork / Blueprint inside the alcove
      const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.85, 0.1), mats.goldBrass);
      outerFrame.position.set(0, 4.15, 0.08);
      const artCanvas = new THREE.Mesh(
        new THREE.PlaneGeometry(2.12, 2.62),
        i % 4 === 0 ? artMatA : artMatB
      );
      artCanvas.position.set(0, 4.15, 0.14);
      bayGroup.add(outerFrame, artCanvas);

      // Picture-rail museum light bar above frame
      const picLight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), mats.goldBrass);
      picLight.rotation.z = Math.PI / 2;
      picLight.position.set(0, 5.75, 0.34);
      bayGroup.add(picLight);
    } else {
      // Sculptural stone relief medallion in alternate bays
      const nicheFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.12), mats.sandstoneDark);
      nicheFrame.position.set(0, 4.15, 0.04);
      const reliefPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), mats.carvedRelief);
      reliefPanel.position.set(0, 4.15, 0.11);
      bayGroup.add(nicheFrame, reliefPanel);
    }

    group.add(bayGroup);
  }

  // 5. Upper Gallery Entablature Cornice, Coffered Dome Ribs & Skylight Oculus
  const corniceRing = new THREE.Mesh(new THREE.TorusGeometry(wallR - 0.1, 0.34, 10, 48), mats.sandstoneDark);
  corniceRing.rotation.x = Math.PI / 2;
  corniceRing.position.y = floorY + 9.0;
  group.add(corniceRing);

  const ceilingDome = new THREE.Mesh(
    new THREE.SphereGeometry(14.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42),
    new THREE.MeshStandardMaterial({
      color: 0x332720,
      roughness: 0.85,
      side: THREE.BackSide,
    })
  );
  ceilingDome.position.y = floorY + 7.4;
  group.add(ceilingDome);

  // Coffered dome ribs converging to central skylight
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const ribCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * 14.0, floorY + 9.0, Math.sin(ang) * 14.0),
      new THREE.Vector3(Math.cos(ang) * 8.6, floorY + 11.4, Math.sin(ang) * 8.6),
      new THREE.Vector3(Math.cos(ang) * 3.4, floorY + 12.6, Math.sin(ang) * 3.4),
    ]);
    const rib = new THREE.Mesh(new THREE.TubeGeometry(ribCurve, 12, 0.13, 6, false), mats.sandstoneDark);
    group.add(rib);
  }

  // Illuminated Central Skylight Oculus
  const oculusFrame = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.2, 10, 36), mats.goldBrass);
  oculusFrame.rotation.x = Math.PI / 2;
  oculusFrame.position.y = floorY + 12.6;
  group.add(oculusFrame);

  const oculusGlass = new THREE.Mesh(
    new THREE.CircleGeometry(3.35, 36),
    new THREE.MeshBasicMaterial({ color: 0xfff0cf, side: THREE.DoubleSide })
  );
  oculusGlass.rotation.x = Math.PI / 2;
  oculusGlass.position.y = floorY + 12.65;
  group.add(oculusGlass);

  // 6. Suspended Brass Track-Lighting Ring & Spotlight Canisters
  const trackRing = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.045, 8, 48), mats.goldBrass);
  trackRing.rotation.x = Math.PI / 2;
  trackRing.position.y = 6.95;
  group.add(trackRing);

  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe4a8 });
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const lx = Math.cos(ang) * 5.6;
    const lz = Math.sin(ang) * 5.6;
    const canister = new THREE.Group();
    canister.position.set(lx, 6.82, lz);
    canister.lookAt(0, 1.4, 0);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.34, 12), mats.goldBrass);
    body.rotation.x = Math.PI / 2;
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), bulbMat);
    lens.position.z = 0.18;
    canister.add(body, lens);
    group.add(canister);
  }

  // 7. Museum Gallery Visitor Benches along outer floor
  for (const bAng of [Math.PI * 0.78, -Math.PI * 0.78]) {
    const bench = new THREE.Group();
    bench.position.set(Math.sin(bAng) * 9.8, floorY, Math.cos(bAng) * 9.8);
    bench.lookAt(0, floorY, 0);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.78), mats.galleryDado);
    seat.position.y = 0.52;
    seat.castShadow = true;
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.68), mats.sandstoneDark);
    legL.position.set(-0.95, 0.24, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.68), mats.sandstoneDark);
    legR.position.set(0.95, 0.24, 0);
    bench.add(seat, legL, legR);
    group.add(bench);
  }

  return {
    group,
    dispose() {
      disposed = true;
      extraTextures.forEach((t) => t.dispose());
    },
  };
}
