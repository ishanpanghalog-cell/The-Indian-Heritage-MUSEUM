import { useEffect, useRef, useState } from 'react';
import { EXHIBITS } from '../../data/museumData';
import {
  EntranceHoverState,
  mountMuseumEntranceScene,
  MuseumEntranceController,
} from '../../three/museumEntranceScene';
import { ExhibitId } from '../../types/museum';
import { MonumentPreviewCard } from '../MonumentPreviewCard';

interface WelcomeEntranceCanvasProps {
  scrollProgress: number;
  highlightedExhibitId?: ExhibitId | null;
  exploredIds?: ExhibitId[];
  onSelectExhibit: (id: ExhibitId) => void;
  onWalkProgress?: (progress: number, nearestExhibitId: ExhibitId | null) => void;
}

export function WelcomeEntranceCanvas({
  scrollProgress,
  highlightedExhibitId = null,
  exploredIds = [],
  onSelectExhibit,
  onWalkProgress,
}: WelcomeEntranceCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MuseumEntranceController | null>(null);
  const selectRef = useRef(onSelectExhibit);
  const walkRef = useRef(onWalkProgress);
  selectRef.current = onSelectExhibit;
  walkRef.current = onWalkProgress;

  const [loaded, setLoaded] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<EntranceHoverState>({
    exhibitId: null,
    screenX: 0,
    screenY: 0,
  });
  const [containerSize, setContainerSize] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const updateSize = () => {
      setContainerSize({
        width: el.clientWidth || window.innerWidth,
        height: el.clientHeight || window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const ctrl = mountMuseumEntranceScene(el, {
      onSelectExhibit: (id) => selectRef.current(id),
      onHoverExhibit: (state) => setHoverInfo(state),
      onWalkProgress: (p, nearest) => walkRef.current?.(p, nearest),
    });
    controllerRef.current = ctrl;

    const timer = window.setTimeout(() => setLoaded(true), 120);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
      ctrl.cleanup();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setScrollProgress(scrollProgress);
  }, [scrollProgress]);

  useEffect(() => {
    controllerRef.current?.highlightExhibit(highlightedExhibitId ?? null);
  }, [highlightedExhibitId]);

  const hoveredExhibit = hoverInfo.exhibitId
    ? EXHIBITS.find((e) => e.id === hoverInfo.exhibitId) ?? null
    : null;

  // Clamp tooltip position safely inside the viewport so it never clips off-screen
  const cardLeft = Math.min(
    Math.max(176, hoverInfo.screenX),
    Math.max(176, containerSize.width - 176)
  );
  const cardTop = Math.max(255, Math.min(hoverInfo.screenY - 18, containerSize.height - 130));

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#140D0A]">
      <div
        ref={mountRef}
        data-testid="welcome-3d-canvas"
        className="w-full h-full"
        aria-label="Interactive 3D walk-in museum courtyard, Torana gateway, and monument gallery corridor"
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#140D0A] text-[#E5D9C3] text-sm tracking-wide">
          Preparing 3D Museum Courtyard &amp; Promenade…
        </div>
      )}

      {hoveredExhibit && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full transition-transform duration-75"
          style={{
            left: `${cardLeft}px`,
            top: `${cardTop}px`,
          }}
        >
          <MonumentPreviewCard
            exhibit={hoveredExhibit}
            isExplored={exploredIds.includes(hoveredExhibit.id)}
            actionHint="Click pedestal to inspect 3D exhibit"
          />
        </div>
      )}
    </div>
  );
}
