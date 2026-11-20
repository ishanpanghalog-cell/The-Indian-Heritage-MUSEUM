import { useEffect, useRef, useState } from 'react';
import { EXHIBITS } from '../../data/museumData';
import {
  HallHoverState,
  mountMuseumHallScene,
  MuseumHallController,
} from '../../three/museumHallScene';
import { ExhibitId } from '../../types/museum';
import { MonumentPreviewCard } from '../MonumentPreviewCard';

interface MuseumHallCanvasProps {
  exploredIds?: ExhibitId[];
  onSelectExhibit: (id: ExhibitId) => void;
}

export function MuseumHallCanvas({
  exploredIds = [],
  onSelectExhibit,
}: MuseumHallCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MuseumHallController | null>(null);
  const selectRef = useRef(onSelectExhibit);
  selectRef.current = onSelectExhibit;

  const [loaded, setLoaded] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<HallHoverState>({
    exhibitId: null,
    screenX: 0,
    screenY: 0,
  });
  const [pathHoveredId, setPathHoveredId] = useState<ExhibitId | null>(null);
  const [boxSize, setBoxSize] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const updateSize = () => {
      setBoxSize({
        width: el.clientWidth || 1000,
        height: el.clientHeight || 500,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const ctrl = mountMuseumHallScene(el, {
      onSelectExhibit: (id) => selectRef.current(id),
      onHoverExhibit: (state) => setHoverInfo(state),
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
    controllerRef.current?.focusExhibit(pathHoveredId);
  }, [pathHoveredId]);

  const hoveredExhibit = hoverInfo.exhibitId
    ? EXHIBITS.find((e) => e.id === hoverInfo.exhibitId) ?? null
    : null;

  const pathHoveredExhibit = pathHoveredId
    ? EXHIBITS.find((e) => e.id === pathHoveredId) ?? null
    : null;

  const pathHoveredIndex = pathHoveredId
    ? EXHIBITS.findIndex((e) => e.id === pathHoveredId)
    : -1;

  const cardLeft = Math.min(Math.max(170, hoverInfo.screenX), Math.max(170, boxSize.width - 170));
  const cardTop = Math.max(255, Math.min(hoverInfo.screenY - 14, boxSize.height - 95));

  return (
    <div className="relative w-full h-[430px] sm:h-[500px] lg:h-[560px] rounded-xl overflow-hidden border border-[#2A1E17]/15 bg-[#281F19]">
      <div
        ref={mountRef}
        data-testid="museum-hall-3d-canvas"
        className="w-full h-full"
        aria-label="Interactive 3D Main Museum Rotunda Hall with nine exhibit pedestals"
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#281F19] text-[#E5D9C3] text-sm">
          Loading Central Museum Rotunda…
        </div>
      )}

      {/* Clean non-overlapping corner caption */}
      <div className="pointer-events-none absolute top-4 left-4 bg-[#1B1410]/92 border border-[#CBB799]/25 rounded-lg px-3.5 py-2 text-[#F8F4EC]">
        <p className="text-xs uppercase tracking-widest text-[#D8A845]">Interactive 3D Rotunda</p>
        <p className="text-xs text-[#E5D9C3] mt-0.5">
          Drag to orbit · Scroll to zoom · Hover any pedestal or path stop to preview
        </p>
      </div>

      {/* Rich Hover Preview Card over 3D pedestal */}
      {hoveredExhibit && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full"
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

      {/* Bottom Rotunda Monument Path Strip with Hover Previews */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(860px,94%)]">
        {pathHoveredExhibit && (
          <div
            className="pointer-events-none hidden sm:block absolute bottom-full mb-3 -translate-x-1/2 z-30"
            style={{
              left: `${Math.min(82, Math.max(18, ((pathHoveredIndex + 0.5) / EXHIBITS.length) * 100))}%`,
            }}
          >
            <MonumentPreviewCard
              exhibit={pathHoveredExhibit}
              isExplored={exploredIds.includes(pathHoveredExhibit.id)}
              actionHint="Click stop to enter exhibit"
            />
          </div>
        )}

        <nav
          aria-label="Rotunda Monument Path"
          className="relative rounded-xl bg-[#140E0B]/92 border border-[#C69632]/40 px-3 py-2 flex items-center justify-between gap-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.6)] overflow-x-auto"
        >
          <span className="hidden md:inline-block text-[11px] uppercase tracking-wider text-[#E6B84D] px-1.5 whitespace-nowrap shrink-0">
            Gallery Path
          </span>
          <div className="flex items-center justify-between flex-1 gap-1">
            {EXHIBITS.map((exhibit) => {
              const isHovered = pathHoveredId === exhibit.id;
              const isVisited = exploredIds.includes(exhibit.id);
              return (
                <button
                  key={exhibit.id}
                  type="button"
                  onClick={() => onSelectExhibit(exhibit.id)}
                  onMouseEnter={() => setPathHoveredId(exhibit.id)}
                  onMouseLeave={() => setPathHoveredId(null)}
                  onFocus={() => setPathHoveredId(exhibit.id)}
                  onBlur={() => setPathHoveredId(null)}
                  className={`flex-1 min-w-[38px] px-2 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-colors tabular-nums whitespace-nowrap border ${
                    isHovered
                      ? 'bg-[#D8A845] text-[#140E0B] border-[#FAF5EA]'
                      : isVisited
                      ? 'bg-[#261B14] text-[#E6B84D] border-[#E6B84D]/45 hover:border-[#E6B84D]'
                      : 'bg-[#1C1410] text-[#E5D9C3] border-[#E6B84D]/25 hover:border-[#E6B84D]/70 hover:text-[#FAF5EA]'
                  }`}
                  aria-label={`Preview and open Exhibit ${exhibit.number}: ${exhibit.shortTitle}`}
                >
                  {exhibit.number}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
