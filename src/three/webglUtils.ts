import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export interface MuseumRendererContext {
  renderer: THREE.WebGLRenderer;
  isSoftwareGl: boolean;
  pmremTexture: THREE.Texture;
}

export function createMuseumRenderer(
  container: HTMLElement,
  scene: THREE.Scene,
  options?: { clearColor?: number }
): MuseumRendererContext {
  const isSoftwareGl = detectSoftwareWebGL();
  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 240);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    alpha: false,
    preserveDrawingBuffer: isSoftwareGl,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if (options?.clearColor !== undefined) {
    renderer.setClearColor(options.clearColor, 1);
  }

  container.innerHTML = '';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const pmremTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = pmremTexture;
  pmremGenerator.dispose();

  return { renderer, isSoftwareGl, pmremTexture };
}

export function addMuseumStudioLighting(
  scene: THREE.Scene,
  options?: { keyPosition?: [number, number, number]; shadowExtent?: number }
): void {
  const hemi = new THREE.HemisphereLight(0xf6eedf, 0x3b2c22, 0.95);
  scene.add(hemi);

  const keyPos = options?.keyPosition ?? [8, 13, 9];
  const extent = options?.shadowExtent ?? 8;

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.15);
  keyLight.position.set(keyPos[0], keyPos[1], keyPos[2]);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -extent;
  keyLight.shadow.camera.right = extent;
  keyLight.shadow.camera.top = extent;
  keyLight.shadow.camera.bottom = -extent;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 38;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb8cbe0, 0.72);
  rimLight.position.set(-9, 6, -8);
  scene.add(rimLight);
}

export function createRadialContactShadow(radius = 3.6, opacity = 0.42): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, 'rgba(12, 8, 5, 0.85)');
    grad.addColorStop(0.55, 'rgba(12, 8, 5, 0.35)');
    grad.addColorStop(1, 'rgba(12, 8, 5, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.CircleGeometry(radius, 36);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.018;
  return mesh;
}

export interface RenderController {
  requestRender: () => void;
  setContinuous: (active: boolean) => void;
  dispose: () => void;
}

export function createRenderController(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  renderStep: (dt: number, elapsed: number) => boolean | void
): RenderController {
  let frameId = 0;
  let timerId = 0;
  let renderBusy = false;
  let renderDirty = false;
  let continuous = false;
  let disposed = false;
  const startTime = performance.now();
  let lastTime = startTime;

  function afterDraw(cb: () => void) {
    if (disposed) return;
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 80);
        }
      };
      timerId = window.setTimeout(poll, 5);
    } else {
      timerId = window.setTimeout(cb, 80);
    }
  }

  function stepFrame() {
    if (disposed) return;
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.08);
    const elapsed = (now - startTime) / 1000;
    lastTime = now;

    renderDirty = false;
    const needsAnother = renderStep(dt, elapsed);

    const onFinish = () => {
      renderBusy = false;
      if (disposed) return;
      if (continuous || needsAnother || renderDirty) {
        scheduleNext();
      }
    };

    if (isSoftwareGl) {
      afterDraw(onFinish);
    } else {
      onFinish();
    }
  }

  function scheduleNext() {
    if (disposed || renderBusy) {
      renderDirty = true;
      return;
    }
    renderBusy = true;
    frameId = requestAnimationFrame(stepFrame);
  }

  return {
    requestRender() {
      scheduleNext();
    },
    setContinuous(active: boolean) {
      continuous = active;
      if (active && !renderBusy) {
        lastTime = performance.now();
        scheduleNext();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    },
  };
}

export function disposeSceneObjects(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (!mat) return;
        for (const value of Object.values(mat)) {
          if (value && (value as THREE.Texture).isTexture) {
            (value as THREE.Texture).dispose();
          }
        }
        mat.dispose();
      });
    }
  });
}
