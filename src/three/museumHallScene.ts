import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXHIBITS } from '../data/museumData';
import { ExhibitId } from '../types/museum';
import { buildMuseumMonumentSpecimen } from './exhibitSpecimens';
import {
  createMuseumMaterials,
  createNumberPlaqueTexture,
  MuseumMaterialSet,
} from './proceduralTextures';
import {
  addMuseumStudioLighting,
  createMuseumRenderer,
  createRadialContactShadow,
  createRenderController,
  disposeSceneObjects,
} from './webglUtils';

export interface HallHoverState {
  exhibitId: ExhibitId | null;
  screenX: number;
  screenY: number;
}

export interface MuseumHallController {
  focusExhibit: (id: ExhibitId | null) => void;
  cleanup: () => void;
}

function createRotundaColumn(mats: MuseumMaterialSet, height = 5.4): THREE.Group {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 0.92), mats.basalt);
  base.position.y = 0.18;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);

  const subBase = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.24, 0.76), mats.sandstoneDark);
  subBase.position.y = 0.48;
  g.add(subBase);

  const shaftH = height - 1.05;
  const pts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.32, 0),
    new THREE.Vector2(0.28, shaftH * 0.14),
    new THREE.Vector2(0.26, shaftH * 0.62),
    new THREE.Vector2(0.23, shaftH * 0.8),
    new THREE.Vector2(0.33, shaftH * 0.9),
    new THREE.Vector2(0.24, shaftH * 0.94),
    new THREE.Vector2(0.36, shaftH),
    new THREE.Vector2(0.01, shaftH),
  ];
  const shaft = new THREE.Mesh(new THREE.LatheGeometry(pts, 14), mats.sandstone);
  shaft.position.y = 0.6;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  g.add(shaft);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.032, 8, 18), mats.goldBrass);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.6 + shaftH * 0.8;
  g.add(ring);

  const corbel = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.26, 0.72), mats.sandstoneDark);
  corbel.position.y = 0.6 + shaftH + 0.13;
  corbel.castShadow = true;
  g.add(corbel);

  return g;
}

export function mountMuseumHallScene(
  container: HTMLElement,
  callbacks: {
    onSelectExhibit: (id: ExhibitId) => void;
    onHoverExhibit: (state: HallHoverState) => void;
  }
): MuseumHallController {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x281f19);
  scene.fog = new THREE.FogExp2(0x281f19, 0.012);

  const { renderer, isSoftwareGl, pmremTexture } = createMuseumRenderer(container, scene, {
    clearColor: 0x281f19,
  });

  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 240);
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 90);
  camera.position.set(0, 7.2, 12.2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.25, -0.6);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.06;
  controls.minDistance = 5.5;
  controls.maxDistance = 13.8;
  controls.maxPolarAngle = Math.PI / 2.08;
  controls.minPolarAngle = 0.26;

  addMuseumStudioLighting(scene, { keyPosition: [6, 14, 8], shadowExtent: 12 });

  // Warm museum rotunda dome bounce light so arches, walls & columns glow warmly
  const rotundaFill = new THREE.PointLight(0xffdfb2, 34, 42, 1.2);
  rotundaFill.position.set(0, 8.8, 0);
  scene.add(rotundaFill);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const mats = createMuseumMaterials(maxAniso);
  const root = new THREE.Group();
  scene.add(root);

  const extraTextures: THREE.Texture[] = [];

  // 1. Museum Rotunda Marble & Brass Compass Floor
  const floor = new THREE.Mesh(new THREE.CircleGeometry(17.5, 64), mats.floorMarble);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  for (const r of [2.6, 6.2, 10.6, 12.8]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.045, r + 0.045, 64), mats.goldBrass);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.015;
    root.add(ring);
  }

  // 2. Central Museum Surya Armillary Sphere Monument
  root.add(createRadialContactShadow(2.4, 0.42));
  const centerBase = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.56, 0.26, 8), mats.basalt);
  centerBase.position.y = 0.13;
  centerBase.receiveShadow = true;
  root.add(centerBase);

  const centerPed = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.28, 0.72, 8), mats.sandstoneDark);
  centerPed.position.y = 0.62;
  centerPed.castShadow = true;
  centerPed.receiveShadow = true;
  root.add(centerPed);

  const centerCap = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.08, 8), mats.goldBrass);
  centerCap.position.y = 1.02;
  root.add(centerCap);

  const centerArmillary = new THREE.Group();
  centerArmillary.position.y = 2.02;
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.042, 10, 36), mats.goldBrass);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.036, 10, 32), mats.goldBrass);
  ringB.rotation.x = Math.PI / 3;
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.028, 10, 28), mats.goldBrass);
  ringC.rotation.y = Math.PI / 4;
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 16), mats.goldBrass);
  centerArmillary.add(ringA, ringB, ringC, sunCore);
  root.add(centerArmillary);

  // 3. Sculpted Rotunda Colonnade Ring (12 Turned Sandstone Columns)
  const colRadius = 11.4;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const rx = Math.cos(angle) * colRadius;
    const rz = Math.sin(angle) * colRadius;
    const col = createRotundaColumn(mats, 5.4);
    col.position.set(rx, 0, rz);
    col.lookAt(0, 0, 0);
    root.add(col);
  }
  const innerCornice = new THREE.Mesh(new THREE.TorusGeometry(colRadius, 0.34, 10, 64), mats.sandstoneDark);
  innerCornice.rotation.x = Math.PI / 2;
  innerCornice.position.y = 5.65;
  root.add(innerCornice);

  // 4. Enclosed Rotunda Outer Museum Walls, Arched Alcoves & Coffered Skylight Dome
  const wallR = 15.6;
  const wallSides = 12;
  const bayWidth = 2 * wallR * Math.tan(Math.PI / wallSides) + 0.25;

  for (let i = 0; i < wallSides; i++) {
    const angle = (i / wallSides) * Math.PI * 2 + Math.PI / wallSides;
    const bay = new THREE.Group();
    bay.position.set(Math.sin(angle) * wallR, 0, Math.cos(angle) * wallR);
    bay.lookAt(0, 0, 0);

    // Dark teak museum dado wainscoting
    const dado = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 1.35, 0.35), mats.galleryDado);
    dado.position.set(0, 0.675, -0.15);
    bay.add(dado);

    const dadoRail = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 0.14, 0.42), mats.sandstoneDark);
    dadoRail.position.set(0, 1.4, -0.12);
    bay.add(dadoRail);

    // Warm gallery plaster upper wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, 6.2, 0.35), mats.galleryWall);
    wall.position.set(0, 4.55, -0.15);
    bay.add(wall);

    // Recessed Arched Museum Alcove + Framed Heritage Art Panel
    const alcoveArch = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.16, 8, 20, Math.PI),
      mats.sandstoneDark
    );
    alcoveArch.position.set(0, 4.4, 0.08);
    bay.add(alcoveArch);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.75, 0.1), mats.goldBrass);
    frame.position.set(0, 3.4, 0.08);
    const panelMat = i % 3 === 0 ? mats.frescoOchre : i % 3 === 1 ? mats.frescoLapis : mats.carvedRelief;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 2.5), panelMat);
    panel.position.set(0, 3.4, 0.14);
    bay.add(frame, panel);

    root.add(bay);
  }

  // Upper Rotunda Entablature, Coffered Dome Ribs & Warm Skylight Oculus
  const outerCornice = new THREE.Mesh(new THREE.TorusGeometry(wallR - 0.15, 0.36, 10, 64), mats.sandstoneDark);
  outerCornice.rotation.x = Math.PI / 2;
  outerCornice.position.y = 7.65;
  root.add(outerCornice);

  const rotundaDome = new THREE.Mesh(
    new THREE.SphereGeometry(16.2, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.42),
    new THREE.MeshStandardMaterial({
      color: 0x382b22,
      roughness: 0.84,
      side: THREE.BackSide,
    })
  );
  rotundaDome.position.y = 6.2;
  root.add(rotundaDome);

  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const ribCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * 15.2, 7.65, Math.sin(ang) * 15.2),
      new THREE.Vector3(Math.cos(ang) * 9.8, 10.6, Math.sin(ang) * 9.8),
      new THREE.Vector3(Math.cos(ang) * 4.0, 12.2, Math.sin(ang) * 4.0),
    ]);
    const rib = new THREE.Mesh(new THREE.TubeGeometry(ribCurve, 12, 0.15, 6, false), mats.sandstoneDark);
    root.add(rib);
  }

  const oculusRim = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.22, 10, 48), mats.goldBrass);
  oculusRim.rotation.x = Math.PI / 2;
  oculusRim.position.y = 12.2;
  root.add(oculusRim);

  const oculusSky = new THREE.Mesh(
    new THREE.CircleGeometry(3.95, 48),
    new THREE.MeshBasicMaterial({ color: 0xfff0ce, side: THREE.DoubleSide })
  );
  oculusSky.rotation.x = Math.PI / 2;
  oculusSky.position.y = 12.25;
  root.add(oculusSky);

  // Museum Gallery Visitor Benches along outer colonnade
  for (let b = 0; b < 4; b++) {
    const bAng = (b / 4) * Math.PI * 2 + Math.PI / 4;
    const bench = new THREE.Group();
    bench.position.set(Math.cos(bAng) * 9.2, 0, Math.sin(bAng) * 9.2);
    bench.lookAt(0, 0, 0);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.72), mats.galleryDado);
    seat.position.y = 0.5;
    seat.castShadow = true;
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.64), mats.sandstoneDark);
    legL.position.set(-0.88, 0.23, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.64), mats.sandstoneDark);
    legR.position.set(0.88, 0.23, 0);
    bench.add(seat, legL, legR);
    root.add(bench);
  }

  // 5. Nine Interactive Museum Exhibit Pedestals with Radial Brass Compass Lines & Plaque Numbers
  const clickables: THREE.Object3D[] = [];
  const pedestalTops: Map<ExhibitId, THREE.Mesh> = new Map();
  const pedestalAngles: Map<ExhibitId, number> = new Map();

  EXHIBITS.forEach((exhibit, idx) => {
    const angle = THREE.MathUtils.lerp(-Math.PI * 0.84, Math.PI * 0.84, idx / (EXHIBITS.length - 1));
    pedestalAngles.set(exhibit.id, angle);
    const radius = 6.2;
    const px = Math.sin(angle) * radius;
    const pz = -Math.cos(angle) * radius;

    // Radial brass floor inlay spoke leading from center astrolabe to pedestal
    const spoke = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 3.2), mats.goldBrass);
    spoke.rotation.x = -Math.PI / 2;
    spoke.rotation.z = -angle;
    spoke.position.set(Math.sin(angle) * 4.3, 0.014, -Math.cos(angle) * 4.3);
    root.add(spoke);

    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(px, 0, pz);
    pedestalGroup.lookAt(0, 0, 0);

    const shadow = createRadialContactShadow(1.22, 0.42);
    pedestalGroup.add(shadow);

    // Stepped museum pedestal base + body + brass trim collar
    const plinthBase = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.0, 0.18, 8), mats.basalt);
    plinthBase.position.y = 0.09;
    plinthBase.receiveShadow = true;
    pedestalGroup.add(plinthBase);

    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.86, 0.88, 8), mats.sandstoneDark);
    plinth.position.y = 0.62;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    pedestalGroup.add(plinth);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.08, 16), mats.goldBrass);
    cap.position.y = 1.09;
    pedestalGroup.add(cap);
    pedestalTops.set(exhibit.id, cap);

    // Engraved Exhibit Number Plaque on front of pedestal (facing center)
    const numTex = createNumberPlaqueTexture(exhibit.number);
    numTex.anisotropy = Math.min(8, maxAniso);
    extraTextures.push(numTex);
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.22),
      new THREE.MeshStandardMaterial({ map: numTex, roughness: 0.4, metalness: 0.2 })
    );
    plaque.position.set(0, 0.72, 0.81);
    pedestalGroup.add(plaque);

    const specimen = buildMuseumMonumentSpecimen(exhibit.id, mats);
    specimen.position.y = 1.13;
    pedestalGroup.add(specimen);

    // Invisible simplified proxy hitbox for smooth Raycasting
    const hitbox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.98, 0.98, 2.45, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitbox.position.y = 1.22;
    hitbox.userData.exhibitId = exhibit.id;
    pedestalGroup.add(hitbox);
    clickables.push(hitbox);

    root.add(pedestalGroup);
  });

  // Raycasting for hover & click
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let lastMove = 0;
  let pointerDownPos = { x: 0, y: 0 };
  let hoveredId: ExhibitId | null = null;

  const updatePointer = (ev: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const onPointerDown = (ev: PointerEvent) => {
    pointerDownPos = { x: ev.clientX, y: ev.clientY };
  };

  const onPointerMove = (ev: PointerEvent) => {
    const now = performance.now();
    if (now - lastMove < 40) return;
    lastMove = now;
    const localPos = updatePointer(ev);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    const hitId = hits.length > 0 ? (hits[0].object.userData.exhibitId as ExhibitId) : null;
    if (hitId !== hoveredId) {
      hoveredId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      pedestalTops.forEach((mesh, id) => {
        mesh.scale.setScalar(id === hitId ? 1.12 : 1.0);
      });
      controller.requestRender();
    }
    callbacks.onHoverExhibit({
      exhibitId: hitId,
      screenX: localPos.x,
      screenY: localPos.y,
    });
  };

  const onPointerUp = (ev: PointerEvent) => {
    const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
    if (dist > 6) return;
    updatePointer(ev);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    if (hits.length > 0) {
      const id = hits[0].object.userData.exhibitId as ExhibitId;
      if (id) callbacks.onSelectExhibit(id);
    }
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  let focusTargetPos: THREE.Vector3 | null = null;
  let focusLookTarget: THREE.Vector3 | null = null;

  const stopFocus = () => {
    focusTargetPos = null;
    focusLookTarget = null;
  };
  controls.addEventListener('start', stopFocus);

  const controller = createRenderController(renderer, isSoftwareGl, (dt) => {
    let transitioning = false;
    if (focusTargetPos && focusLookTarget) {
      const k = isSoftwareGl ? 1 : 1 - Math.exp(-5.5 * dt);
      camera.position.lerp(focusTargetPos, k);
      controls.target.lerp(focusLookTarget, k);
      if (camera.position.distanceTo(focusTargetPos) < 0.05) {
        stopFocus();
      } else {
        transitioning = true;
      }
    }
    const activeDamping = controls.update();
    if (!isSoftwareGl) {
      centerArmillary.rotation.y += dt * 0.25;
    }
    renderer.render(scene, camera);
    return Boolean(activeDamping) || transitioning;
  });

  controls.addEventListener('change', () => controller.requestRender());
  controls.update();
  renderer.render(scene, camera);
  controller.requestRender();

  const handleResize = () => {
    const w = Math.max(container.clientWidth, 320);
    const h = Math.max(container.clientHeight, 240);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    controller.requestRender();
  };
  window.addEventListener('resize', handleResize);

  const focusExhibit = (id: ExhibitId | null) => {
    pedestalTops.forEach((mesh, exId) => {
      mesh.scale.setScalar(exId === id ? 1.14 : 1.0);
    });
    if (!id) {
      stopFocus();
      controller.requestRender();
      return;
    }
    const angle = pedestalAngles.get(id);
    if (angle === undefined) return;
    const px = Math.sin(angle) * 6.2;
    const pz = -Math.cos(angle) * 6.2;
    // Position camera inside the rotunda looking cleanly toward the chosen monument pedestal
    focusTargetPos = new THREE.Vector3(-Math.sin(angle) * 2.2, 4.1, Math.cos(angle) * 2.2);
    focusLookTarget = new THREE.Vector3(px * 0.85, 1.45, pz * 0.85);
    controller.requestRender();
  };

  return {
    focusExhibit,
    cleanup: () => {
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', stopFocus);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      controller.dispose();
      extraTextures.forEach((t) => t.dispose());
      disposeSceneObjects(root);
      pmremTexture.dispose();
      renderer.dispose();
    },
  };
}
