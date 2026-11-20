import * as THREE from 'three';
import { ExhibitId } from '../types/museum';
import { MuseumMaterialSet } from './proceduralTextures';

/**
 * Builds composite 3D architectural monument models for museum display pedestals
 * in both the Promenade Walk-In Hall and the Central Rotunda.
 */
export function buildMuseumMonumentSpecimen(
  id: ExhibitId,
  mats: MuseumMaterialSet
): THREE.Group {
  const g = new THREE.Group();

  const mkBox = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material
  ) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  const mkCyl = (
    rt: number,
    rb: number,
    h: number,
    s: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material
  ) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  switch (id) {
    case 'water-lab': {
      // Stepped subterranean baori / kund geometry
      mkBox(0.98, 0.14, 0.98, 0, 0.07, 0, mats.sandstoneDark);
      mkBox(0.84, 0.16, 0.84, 0, 0.22, 0, mats.sandstone);
      mkBox(0.64, 0.14, 0.64, 0, 0.34, 0, mats.water);
      // Stepped side terraces
      mkBox(0.18, 0.24, 0.84, -0.38, 0.28, 0, mats.carvedRelief);
      mkBox(0.18, 0.24, 0.84, 0.38, 0.28, 0, mats.carvedRelief);
      // Intake aqueduct & corner chhatri pavilion
      mkBox(0.42, 0.2, 0.16, -0.5, 0.44, 0, mats.sandstone);
      mkCyl(0.05, 0.16, 0.22, 10, 0, 0.56, -0.36, mats.terracotta);
      break;
    }

    case 'brihadeeswarar': {
      // Granite plinth + 7-tier Dravidian Vimana + Nandi pavilion
      mkBox(0.9, 0.16, 1.04, 0, 0.08, 0, mats.granite);
      for (let i = 0; i < 7; i++) {
        const w = 0.68 - i * 0.08;
        mkBox(
          w,
          0.13,
          w,
          0,
          0.22 + i * 0.13,
          -0.1,
          i % 2 === 0 ? mats.granite : mats.carvedRelief
        );
      }
      const kumbam = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), mats.goldBrass);
      kumbam.position.set(0, 1.15, -0.1);
      g.add(kumbam);
      mkCyl(0.03, 0.09, 0.18, 8, 0, 1.28, -0.1, mats.goldBrass);
      // Front mandapa + Nandi shrine
      mkBox(0.36, 0.22, 0.32, 0, 0.25, 0.24, mats.sandstoneDark);
      mkBox(0.22, 0.18, 0.22, 0, 0.23, 0.44, mats.carvedRelief);
      break;
    }

    case 'ajanta-caves': {
      // Basalt horseshoe cliff + Gavaksha arch + inner golden stupa
      mkBox(0.96, 0.74, 0.68, 0, 0.37, -0.06, mats.basalt);
      mkBox(0.86, 0.18, 0.56, 0, 0.78, -0.08, mats.mossStone);
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.06, 10, 20, Math.PI),
        mats.carvedRelief
      );
      arch.position.set(0, 0.42, 0.29);
      g.add(arch);
      // Flanking basalt columns
      mkCyl(0.045, 0.055, 0.46, 8, -0.32, 0.23, 0.28, mats.sandstoneDark);
      mkCyl(0.045, 0.055, 0.46, 8, 0.32, 0.23, 0.28, mats.sandstoneDark);
      mkCyl(0.14, 0.16, 0.28, 12, 0, 0.24, 0.05, mats.goldBrass);
      break;
    }

    case 'gol-gumbaz': {
      // Monumental cube + 4 octagonal corner minars + hemispherical dome
      mkBox(0.78, 0.46, 0.78, 0, 0.23, 0, mats.sandstoneDark);
      const cornice = new THREE.Mesh(
        new THREE.BoxGeometry(0.84, 0.06, 0.84),
        mats.carvedRelief
      );
      cornice.position.set(0, 0.48, 0);
      g.add(cornice);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
        mats.limestone
      );
      dome.position.set(0, 0.5, 0);
      dome.castShadow = true;
      g.add(dome);
      mkCyl(0.015, 0.05, 0.22, 8, 0, 0.94, 0, mats.goldBrass);
      for (const sx of [-0.41, 0.41]) {
        for (const sz of [-0.41, 0.41]) {
          mkCyl(0.06, 0.072, 0.62, 8, sx, 0.31, sz, mats.sandstone);
          const cap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), mats.limestone);
          cap.position.set(sx, 0.63, sz);
          g.add(cap);
        }
      }
      break;
    }

    case 'martand-sun': {
      // Elevated limestone plinth + trefoil peristyle + pyramidal Kashmiri roof
      mkBox(1.02, 0.12, 1.02, 0, 0.06, 0, mats.limestone);
      mkBox(0.44, 0.36, 0.44, 0, 0.29, 0, mats.limestone);
      const pyrLower = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.24, 4), mats.sandstone);
      pyrLower.rotation.y = Math.PI / 4;
      pyrLower.position.set(0, 0.58, 0);
      g.add(pyrLower);
      const pyrUpper = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.32, 4), mats.limestone);
      pyrUpper.rotation.y = Math.PI / 4;
      pyrUpper.position.set(0, 0.78, 0);
      g.add(pyrUpper);
      for (const cx of [-0.38, 0, 0.38]) {
        mkCyl(0.035, 0.042, 0.34, 8, cx, 0.28, 0.38, mats.limestone);
        mkCyl(0.035, 0.042, 0.34, 8, cx, 0.28, -0.38, mats.limestone);
      }
      break;
    }

    case 'kailasa-ellora': {
      // Excavated U-shaped basalt cliff walls + monolithic central vimana & twin pillars
      mkBox(1.0, 0.7, 0.18, 0, 0.35, -0.38, mats.basalt);
      mkBox(0.18, 0.7, 0.86, -0.41, 0.35, 0, mats.basalt);
      mkBox(0.18, 0.7, 0.86, 0.41, 0.35, 0, mats.basalt);
      mkBox(0.44, 0.42, 0.52, 0, 0.24, 0.04, mats.sandstoneDark);
      mkBox(0.25, 0.36, 0.25, 0, 0.62, -0.06, mats.carvedRelief);
      mkCyl(0.03, 0.07, 0.16, 8, 0, 0.86, -0.06, mats.goldBrass);
      // Twin Dhvajastambha flagstaffs
      mkCyl(0.035, 0.045, 0.56, 6, -0.22, 0.28, 0.28, mats.sandstone);
      mkCyl(0.035, 0.045, 0.56, 6, 0.22, 0.28, 0.28, mats.sandstone);
      break;
    }

    case 'konark-sun': {
      // Chariot platform + carved solar wheels + tiered Jagamohana roof
      mkBox(0.88, 0.22, 0.64, -0.06, 0.11, 0, mats.sandstoneDark);
      for (const side of [-0.34, 0.34]) {
        const wheel = new THREE.Mesh(
          new THREE.TorusGeometry(0.22, 0.038, 8, 22),
          mats.goldBrass
        );
        wheel.position.set(0.08, 0.24, side);
        g.add(wheel);
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.06, 10),
          mats.goldBrass
        );
        hub.rotation.x = Math.PI / 2;
        hub.position.set(0.08, 0.24, side);
        g.add(hub);
      }
      for (let t = 0; t < 4; t++) {
        mkBox(
          0.56 - t * 0.1,
          0.12,
          0.5 - t * 0.09,
          -0.08,
          0.28 + t * 0.12,
          0,
          t % 2 === 0 ? mats.sandstone : mats.carvedRelief
        );
      }
      mkCyl(0.025, 0.1, 0.18, 8, -0.08, 0.78, 0, mats.terracotta);
      break;
    }

    case 'living-root-bridges': {
      // Mossy gorge banks + rushing stream + braided living aerial root arch
      mkBox(0.32, 0.36, 0.7, -0.37, 0.18, 0, mats.mossStone);
      mkBox(0.32, 0.36, 0.7, 0.37, 0.18, 0, mats.mossStone);
      mkBox(0.56, 0.06, 0.7, 0, 0.03, 0, mats.water);
      // Ficus trunk + foliage crown
      mkCyl(0.05, 0.08, 0.45, 8, -0.38, 0.56, -0.14, mats.woodBark);
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), mats.mossStone);
      canopy.position.set(-0.38, 0.84, -0.14);
      g.add(canopy);
      // Braided root suspension curves
      for (const dz of [-0.1, 0, 0.1]) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.36, 0.36, dz),
          new THREE.Vector3(0, 0.24 + Math.abs(dz) * 0.35, dz * 0.7),
          new THREE.Vector3(0.36, 0.36, dz),
        ]);
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 14, 0.032, 6, false),
          mats.woodBark
        );
        tube.castShadow = true;
        g.add(tube);
      }
      break;
    }

    case 'mysorean-rockets': {
      // Hardwood cradle + hammered soft-iron propellant cylinder + bamboo stabilizer shaft
      mkBox(0.72, 0.08, 0.3, 0, 0.04, 0, mats.galleryDado);
      mkBox(0.08, 0.24, 0.14, -0.16, 0.16, 0, mats.sandstoneDark);
      mkBox(0.08, 0.34, 0.14, 0.18, 0.21, 0, mats.sandstoneDark);
      const cyl = mkCyl(0.09, 0.09, 0.58, 16, 0.14, 0.38, 0, mats.softIron);
      cyl.rotation.z = Math.PI / 2.4;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 14), mats.goldBrass);
      cone.position.set(0.41, 0.47, 0);
      cone.rotation.z = -Math.PI / 2 + Math.PI / 2.4;
      g.add(cone);
      const pole = mkCyl(0.02, 0.024, 1.08, 8, -0.14, 0.26, 0, mats.sandstone);
      pole.rotation.z = Math.PI / 2.4;
      break;
    }
  }

  return g;
}
