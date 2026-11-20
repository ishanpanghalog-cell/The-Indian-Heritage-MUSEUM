import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ChevronDown, ChevronUp, Eye, EyeOff, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { ExhibitData, ViewerModeId } from '../../types/museum';
import { buildExhibitModel, BuiltExhibitModel } from '../../three/exhibitModels';
import { createMuseumGalleryEnvironment } from '../../three/museumGalleryEnvironment';
import { createMuseumMaterials } from '../../three/proceduralTextures';
import {
  addMuseumStudioLighting,
  createMuseumRenderer,
  createRenderController,
  detectSoftwareWebGL,
  disposeSceneObjects,
  RenderController,
} from '../../three/webglUtils';

interface ExhibitViewer3DProps {
  exhibit: ExhibitData;
}

interface ProjectedHotspot {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  visible: boolean;
}

const _vec3 = new THREE.Vector3();

function resolveHotspotOverlaps(
  items: ProjectedHotspot[],
  width: number,
  height: number
): ProjectedHotspot[] {
  const minX = 110;
  const maxX = Math.max(minX + 20, width - 110);
  const minY = 44;
  const maxY = Math.max(minY + 40, height - 132);

  // Clamp initial coordinates into safe viewport area (away from bottom dock & top-left box)
  const adjusted = items.map((item) => {
    let x = THREE.MathUtils.clamp(item.x, minX, maxX);
    let y = THREE.MathUtils.clamp(item.y, minY, maxY);
    // Keep clear of top-left mode description card on desktop/tablet
    if (width >= 640 && x < 355 && y < 126) {
      y = 132;
    }
    return { ...item, x, y };
  });

  // Iterative screen-space separation so labels never collide
  const boxW = 215;
  const boxH = 38;
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < adjusted.length; i++) {
      if (!adjusted[i].visible) continue;
      for (let j = i + 1; j < adjusted.length; j++) {
        if (!adjusted[j].visible) continue;
        const dx = adjusted[j].x - adjusted[i].x;
        const dy = adjusted[j].y - adjusted[i].y;
        const overlapX = boxW - Math.abs(dx);
        const overlapY = boxH - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          if (overlapY <= overlapX || Math.abs(dy) < 28) {
            const pushY = (overlapY / 2 + 4) * (dy >= 0 ? 1 : -1);
            adjusted[i].y = THREE.MathUtils.clamp(adjusted[i].y - pushY, minY, maxY);
            adjusted[j].y = THREE.MathUtils.clamp(adjusted[j].y + pushY, minY, maxY);
          } else {
            const pushX = (overlapX / 2 + 4) * (dx >= 0 ? 1 : -1);
            adjusted[i].x = THREE.MathUtils.clamp(adjusted[i].x - pushX, minX, maxX);
            adjusted[j].x = THREE.MathUtils.clamp(adjusted[j].x + pushX, minX, maxX);
          }
        }
      }
    }
  }

  return adjusted;
}

export function ExhibitViewer3D({ exhibit }: ExhibitViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<BuiltExhibitModel | null>(null);
  const controllerRef = useRef<RenderController | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const desiredCamPosRef = useRef<THREE.Vector3 | null>(null);
  const desiredTargetRef = useRef<THREE.Vector3 | null>(null);

  const [activeMode, setActiveMode] = useState<ViewerModeId>(exhibit.modes[0]?.id ?? 'standard');
  const activeModeRef = useRef<ViewerModeId>(activeMode);

  const [showHotspots, setShowHotspots] = useState(true);
  const showHotspotsRef = useRef(true);
  showHotspotsRef.current = showHotspots;

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);
  const [autoRotate, setAutoRotate] = useState(false);
  const autoRotateRef = useRef(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset mode when switching exhibit
  useEffect(() => {
    const initialMode = exhibit.modes[0]?.id ?? 'standard';
    setActiveMode(initialMode);
    activeModeRef.current = initialMode;
    setSelectedHotspotId(null);
    setAutoRotate(false);
    autoRotateRef.current = false;
  }, [exhibit]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoaded(false);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x281f19);
    scene.fog = new THREE.FogExp2(0x281f19, 0.013);

    const { renderer, isSoftwareGl, pmremTexture } = createMuseumRenderer(container, scene, {
      clearColor: 0x281f19,
    });

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 260);
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    camera.position.set(...exhibit.cameraPresets.overview);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...exhibit.cameraPresets.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.6;
    controls.maxDistance = 12.6;
    controls.minPolarAngle = 0.22;
    controls.maxPolarAngle = Math.PI / 2.04;
    controlsRef.current = controls;

    addMuseumStudioLighting(scene, { keyPosition: [7, 12, 8], shadowExtent: 7 });

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const mats = createMuseumMaterials(maxAniso);

    let controller: RenderController | null = null;
    const galleryRoom = createMuseumGalleryEnvironment(
      scene,
      mats,
      exhibit,
      maxAniso,
      () => controller?.requestRender()
    );

    const built = buildExhibitModel(exhibit.id, mats);
    built.setMode(activeModeRef.current);
    scene.add(built.group);
    modelRef.current = built;

    const projectHotspots = () => {
      if (!showHotspotsRef.current) {
        setProjectedHotspots([]);
        return;
      }
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;

      const raw: ProjectedHotspot[] = exhibit.hotspots.map((hs) => {
        _vec3.set(hs.position[0], hs.position[1], hs.position[2]);
        _vec3.project(camera);
        const px = ((_vec3.x + 1) / 2) * w;
        const py = ((-_vec3.y + 1) / 2) * h;
        const visible = _vec3.z >= -1 && _vec3.z <= 1;
        return {
          id: hs.id,
          label: hs.label,
          description: hs.description,
          x: px,
          y: py,
          visible,
        };
      });
      setProjectedHotspots(resolveHotspotOverlaps(raw, w, h));
    };

    controller = createRenderController(renderer, isSoftwareGl, (dt, elapsed) => {
      let needsNext = false;

      if (desiredCamPosRef.current && desiredTargetRef.current) {
        if (isSoftwareGl) {
          camera.position.copy(desiredCamPosRef.current);
          controls.target.copy(desiredTargetRef.current);
          desiredCamPosRef.current = null;
          desiredTargetRef.current = null;
        } else {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamPosRef.current.x, 7, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamPosRef.current.y, 7, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamPosRef.current.z, 7, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, desiredTargetRef.current.x, 7, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, desiredTargetRef.current.y, 7, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, desiredTargetRef.current.z, 7, dt);

          if (camera.position.distanceTo(desiredCamPosRef.current) < 0.04) {
            desiredCamPosRef.current = null;
            desiredTargetRef.current = null;
          } else {
            needsNext = true;
          }
        }
      }

      controls.autoRotate = autoRotateRef.current && !isSoftwareGl;
      controls.autoRotateSpeed = 1.4;
      const ctrlUpdated = controls.update();
      const modelAnimated = built.update(dt, elapsed, activeModeRef.current);

      renderer.render(scene, camera);
      projectHotspots();

      return Boolean(needsNext || ctrlUpdated || modelAnimated || (autoRotateRef.current && !isSoftwareGl));
    });

    controllerRef.current = controller;

    const onControlStart = () => {
      desiredCamPosRef.current = null;
      desiredTargetRef.current = null;
    };
    const onControlChange = () => {
      controller?.requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    if (activeModeRef.current === 'animated') {
      controller.setContinuous(true);
    } else {
      controller.requestRender();
    }

    const readyTimer = window.setTimeout(() => setIsLoaded(true), 100);

    const handleResize = () => {
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 260);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      controller?.requestRender();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      controller?.dispose();
      galleryRoom.dispose();
      disposeSceneObjects(galleryRoom.group);
      disposeSceneObjects(built.group);
      pmremTexture.dispose();
      renderer.dispose();
      modelRef.current = null;
      controllerRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
    };
  }, [exhibit]);

  const handleModeChange = (mode: ViewerModeId) => {
    setActiveMode(mode);
    activeModeRef.current = mode;
    modelRef.current?.setMode(mode);
    const shouldLoop = mode === 'animated' || (autoRotateRef.current && !detectSoftwareWebGL());
    controllerRef.current?.setContinuous(shouldLoop);
    controllerRef.current?.requestRender();
  };

  const handleCameraPreset = (preset: 'overview' | 'detail' | 'top') => {
    const pos = exhibit.cameraPresets[preset];
    desiredCamPosRef.current = new THREE.Vector3(pos[0], pos[1], pos[2]);
    desiredTargetRef.current = new THREE.Vector3(...exhibit.cameraPresets.target);
    controllerRef.current?.requestRender();
  };

  const handleZoom = (factor: number) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const offset = cam.position.clone().sub(ctrl.target);
    const nextDist = THREE.MathUtils.clamp(offset.length() * factor, 2.8, 12.4);
    offset.setLength(nextDist);
    desiredCamPosRef.current = ctrl.target.clone().add(offset);
    desiredTargetRef.current = ctrl.target.clone();
    controllerRef.current?.requestRender();
  };

  const toggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    autoRotateRef.current = next;
    if (next && !detectSoftwareWebGL()) {
      controllerRef.current?.setContinuous(true);
    } else if (activeModeRef.current !== 'animated') {
      controllerRef.current?.setContinuous(false);
    }
    controllerRef.current?.requestRender();
  };

  const activeModeObj = exhibit.modes.find((m) => m.id === activeMode);
  const selectedHotspot = exhibit.hotspots.find((h) => h.id === selectedHotspotId);

  return (
    <div className="relative w-full h-[420px] sm:h-[470px] lg:h-[520px] rounded-xl overflow-hidden border border-[#2A1E17]/15 bg-[#281F19]">
      {/* Dedicated Empty WebGL Container */}
      <div
        ref={mountRef}
        data-testid="exhibit-3d-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={`Interactive 3D architectural model of ${exhibit.title}`}
      />

      {/* Initial Loading Backdrop */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#281F19] text-[#E5D9C3] text-sm">
          Preparing 3D Gallery: {exhibit.shortTitle}…
        </div>
      )}

      {/* Top-Left Minimal Mode Description */}
      <div className="hidden sm:block pointer-events-none absolute top-4 left-4 z-10 max-w-xs bg-[#1B1410]/88 border border-[#CBB799]/25 rounded-lg px-3.5 py-2.5 text-[#F8F4EC]">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[#D8A845]">
          {activeModeObj?.label ?? '3D Inspection'}
        </p>
        <p className="text-xs text-[#E5D9C3] mt-0.5 leading-relaxed">
          {activeModeObj?.description}
        </p>
      </div>

      {/* Interactive 3D Hotspot Markers */}
      {showHotspots &&
        projectedHotspots.map((hs, index) => {
          if (!hs.visible) return null;
          const isSelected = hs.id === selectedHotspotId;
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => setSelectedHotspotId(isSelected ? null : hs.id)}
              aria-label={`Inspect ${hs.label}`}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-transform whitespace-nowrap shadow-md ${
                isSelected
                  ? 'bg-[#C69632] text-[#1B1410] scale-105'
                  : 'bg-[#1B1410]/92 text-[#F8F4EC] border border-[#C69632]/60 hover:bg-[#2A1E17]'
              }`}
              style={{
                left: `${hs.x}px`,
                top: `${hs.y}px`,
              }}
            >
              <span className="font-mono text-[10px] opacity-80">{index + 1}</span>
              <span>{hs.label}</span>
            </button>
          );
        })}

      {/* Selected Hotspot Detail Drawer */}
      {showHotspots && selectedHotspot && (
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:top-4 sm:right-4 z-20 sm:w-72 bg-[#1B1410]/95 border border-[#C69632]/40 rounded-lg p-3.5 text-[#F8F4EC] shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-[#D8A845] leading-snug">
              {selectedHotspot.label}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedHotspotId(null)}
              aria-label="Close hotspot explanation"
              className="text-xs text-[#CBB799] hover:text-white px-1.5 py-0.5 rounded"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-[#E5D9C3] mt-1.5 leading-relaxed">
            {selectedHotspot.description}
          </p>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-[min(880px,94%)] transition-transform duration-200 ${
          controlsCollapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={() => setControlsCollapsed((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#1B1410]/95 border border-b-0 border-[#CBB799]/25 text-[11px] font-medium text-[#E5D9C3] hover:text-white whitespace-nowrap"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide 3D Controls</span>
            </>
          )}
        </button>

        <div className="w-full bg-[#1B1410]/95 border border-[#CBB799]/25 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xl">
          {/* Interactive Modes */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="3D model display modes">
            {exhibit.modes.map((m) => {
              const active = m.id === activeMode;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeChange(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#C69632] text-[#1B1410]'
                      : 'bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22]'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Camera & Label Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCameraPreset('overview')}
              className="px-2.5 py-1.5 rounded-lg bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22] text-xs whitespace-nowrap shrink-0"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleCameraPreset('detail')}
              className="px-2.5 py-1.5 rounded-lg bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22] text-xs whitespace-nowrap shrink-0"
            >
              Close-Up
            </button>
            <button
              type="button"
              onClick={() => handleCameraPreset('top')}
              className="px-2.5 py-1.5 rounded-lg bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22] text-xs whitespace-nowrap shrink-0"
            >
              Top Plan
            </button>
            <button
              type="button"
              onClick={() => handleZoom(0.78)}
              aria-label="Zoom in 3D model"
              className="p-1.5 rounded-lg bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(1.26)}
              aria-label="Zoom out 3D model"
              className="p-1.5 rounded-lg bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleAutoRotate}
              aria-label="Toggle 3D model auto-rotation"
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap shrink-0 ${
                autoRotate
                  ? 'bg-[#C69632] text-[#1B1410] font-medium'
                  : 'bg-[#2A1E17] text-[#E5D9C3] hover:bg-[#3A2B22]'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Spin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !showHotspots;
                setShowHotspots(next);
                showHotspotsRef.current = next;
                controllerRef.current?.requestRender();
              }}
              aria-label={showHotspots ? 'Hide 3D labels' : 'Show 3D labels'}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap shrink-0 ${
                showHotspots
                  ? 'bg-[#3A2B22] text-[#F8F4EC] border border-[#C69632]/40'
                  : 'bg-[#2A1E17] text-[#CBB799]'
              }`}
            >
              {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Labels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
