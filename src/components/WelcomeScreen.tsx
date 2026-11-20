import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Compass, Footprints } from 'lucide-react';
import { EXHIBITS } from '../data/museumData';
import { WALK_STOPS } from '../three/museumEntranceScene';
import { ExhibitId } from '../types/museum';
import { MonumentPreviewCard } from './MonumentPreviewCard';
import { WelcomeEntranceCanvas } from './three/WelcomeEntranceCanvas';

interface WelcomeScreenProps {
  exploredIds?: ExhibitId[];
  onEnterMuseum: () => void;
  onOpenGuide: () => void;
  onSelectExhibit: (id: ExhibitId) => void;
}

export function WelcomeScreen({
  exploredIds = [],
  onEnterMuseum,
  onOpenGuide,
  onSelectExhibit,
}: WelcomeScreenProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [walkProgress, setWalkProgress] = useState(0);
  const [nearestExhibitId, setNearestExhibitId] = useState<ExhibitId | null>(null);
  const [pathHoveredId, setPathHoveredId] = useState<ExhibitId | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(nextProgress);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const scrollToProgress = (targetProgress: number) => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: Math.round(targetProgress * maxScroll),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const handleBeginWalk = () => {
    // Walk smoothly into and through the Torana Gateway toward Exhibit 01
    scrollToProgress(0.25);
  };

  const nearestExhibit = nearestExhibitId
    ? EXHIBITS.find((ex) => ex.id === nearestExhibitId) ?? null
    : null;

  const pathHoveredExhibit = pathHoveredId
    ? EXHIBITS.find((ex) => ex.id === pathHoveredId) ?? null
    : null;

  const pathHoveredIndex = pathHoveredId
    ? EXHIBITS.findIndex((ex) => ex.id === pathHoveredId)
    : -1;

  // Stage label based on walk progress
  let stageLabel = 'Outer Courtyard · Approach to the Gateway';
  if (walkProgress >= 0.09 && walkProgress < 0.21) {
    stageLabel = 'Torana Gateway · Stepping Inside the Museum';
  } else if (walkProgress >= 0.21 && walkProgress < 0.92) {
    stageLabel = nearestExhibit
      ? `Grand Promenade · Passing Exhibit ${nearestExhibit.number}: ${nearestExhibit.shortTitle}`
      : 'Grand Monument Promenade · Nine Permanent Galleries';
  } else if (walkProgress >= 0.92) {
    stageLabel = 'Central Rotunda Threshold · Surya Armillary Sphere';
  }

  // Hero text fades away gracefully as the visitor walks up to and through the gateway
  const heroOpacity = Math.max(0, 1 - scrollProgress / 0.14);
  const showRotundaCta = walkProgress >= 0.91;

  return (
    <div ref={trackRef} className="relative w-full bg-[#090706] text-[#FAF5EA]" style={{ height: '560vh' }}>
      {/* Sticky Full-Viewport Interactive 3D Museum Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <WelcomeEntranceCanvas
            scrollProgress={scrollProgress}
            highlightedExhibitId={pathHoveredId}
            exploredIds={exploredIds}
            onSelectExhibit={onSelectExhibit}
            onWalkProgress={(p, nearest) => {
              setWalkProgress(p);
              setNearestExhibitId(nearest);
            }}
          />

          {/* Subtle top & bottom contrast scrims keeping center 3D stage luminous */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-[#070505]/92 via-[#070505]/45 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-44 pointer-events-none bg-gradient-to-t from-[#060404]/92 via-[#080605]/50 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Clean 3-Zone Top Institutional Bar */}
        <header className="relative z-20 max-w-[1380px] w-full mx-auto px-5 sm:px-8 pt-4 sm:pt-5 flex items-center justify-between gap-6">
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#FAF5EA] whitespace-nowrap shrink-0">
            The Indian Heritage Museum
          </span>

          <p className="hidden md:block text-xs tracking-wider uppercase text-[#E6B84D] truncate text-center">
            {stageLabel}
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EFE4CE] hover:text-[#F0C968] transition-colors whitespace-nowrap shrink-0 underline decoration-[#E6B84D]/50 underline-offset-4"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Visitor Guide</span>
            </button>
            <button
              type="button"
              onClick={onEnterMuseum}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D8A845] text-[#140E0B] text-xs font-semibold hover:bg-[#E9BF5C] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Enter Rotunda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Opening Courtyard Welcome Overlay (fades smoothly as you scroll through the gateway) */}
        {heroOpacity > 0.02 && (
          <section
            aria-label="Museum Courtyard Introduction"
            className="relative z-10 max-w-3xl mx-auto px-5 pt-6 sm:pt-10 text-center pointer-events-none"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${Math.round((1 - heroOpacity) * -28)}px)`,
            }}
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-[#F0C968] font-medium">
              Architecture · Engineering · Ancient Science
            </p>
            <h1
              className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-[#FAF5EA] leading-[1.06] mt-2"
              style={{ textShadow: '0 4px 24px rgba(0,0,0,0.92)' }}
            >
              Step Through the Gateway Into Ancient India
            </h1>
            <p
              className="mt-2.5 text-sm sm:text-lg text-[#F3E7CF] max-w-xl mx-auto leading-relaxed"
              style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95)' }}
            >
              Scroll down to walk across the courtyard, pass beneath the carved Torana gateway, and stroll along the monument gallery path. Hover over any monument for a preview.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={handleBeginWalk}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#D8A845] via-[#E9BF5C] to-[#C69632] text-[#140E0B] font-semibold text-sm tracking-wide hover:brightness-110 transition-all shadow-[0_10px_28px_rgba(216,168,69,0.32)] whitespace-nowrap"
              >
                <Footprints className="w-4 h-4" />
                <span>Walk Through Gateway</span>
              </button>
              <button
                type="button"
                onClick={onEnterMuseum}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#E6B84D]/45 bg-[#140E0B]/88 text-[#FAF5EA] text-sm font-medium hover:border-[#F0C968] transition-colors whitespace-nowrap"
              >
                <span>Skip to Main Hall</span>
                <ArrowRight className="w-4 h-4 text-[#E6B84D]" />
              </button>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#E6B84D]">
              <ChevronDown className="w-4 h-4" />
              <span>Scroll to walk inside</span>
            </div>
          </section>
        )}

        {/* Rotunda Threshold Arrival Banner at End of Path */}
        {showRotundaCta && (
          <div className="absolute inset-x-0 bottom-36 z-20 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto max-w-lg w-full rounded-xl bg-[#140E0B]/94 border border-[#C69632]/55 px-5 py-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.75)]">
              <p className="text-[11px] uppercase tracking-widest text-[#E6B84D]">
                End of the Promenade Path
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF5EA] mt-1">
                Enter the Main Museum Rotunda
              </h2>
              <p className="text-xs sm:text-sm text-[#E5D9C3] mt-1.5">
                Access all nine interactive 3D engineering models, scientific diagrams, and museum quizzes.
              </p>
              <div className="mt-3.5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onEnterMuseum}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D8A845] text-[#140E0B] text-sm font-semibold hover:bg-[#E9BF5C] transition-colors"
                >
                  <span>Enter Main Rotunda</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToProgress(0)}
                  className="px-4 py-2.5 rounded-lg border border-[#E6B84D]/35 bg-[#1E1510] text-[#FAF5EA] text-xs font-medium hover:border-[#E6B84D] transition-colors"
                >
                  Return to Courtyard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Bottom Museum Promenade Path Dock */}
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(980px,95vw)] transition-transform duration-300"
          style={{
            transform: dockCollapsed
              ? 'translate(-50%, calc(100% - 26px))'
              : 'translate(-50%, 0)',
          }}
        >
          {/* Collapse / Expand Toggle Tab */}
          <div className="flex justify-center mb-1">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#140E0B]/94 border border-b-0 border-[#C69632]/40 text-[11px] font-medium text-[#E6B84D] hover:text-[#FAF5EA] transition-colors whitespace-nowrap"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Show Gallery Path</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Hide Gallery Path</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-xl bg-[#140E0B]/94 border border-[#C69632]/45 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.75)]">
            {/* Preview Card popped cleanly above the hovered Path Node */}
            {pathHoveredExhibit && !dockCollapsed && (
              <div
                className="pointer-events-none hidden sm:block absolute bottom-full mb-3 -translate-x-1/2 z-40"
                style={{
                  left: `${Math.min(82, Math.max(18, ((pathHoveredIndex + 1.5) / 11) * 100))}%`,
                }}
              >
                <MonumentPreviewCard
                  exhibit={pathHoveredExhibit}
                  isExplored={exploredIds.includes(pathHoveredExhibit.id)}
                  actionHint="Click stop to walk here · Click 3D monument to inspect"
                />
              </div>
            )}

            {/* Top Row inside Dock: Active Station Readout + Quick Inspect CTA */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E6B84D]/15 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[#E6B84D] tabular-nums shrink-0">
                  {Math.round(walkProgress * 100)}% Walked
                </span>
                <span className="text-[#CBB799]/50" aria-hidden="true">·</span>
                <span className="text-[#F3E7CF] truncate">
                  {nearestExhibit
                    ? `Now Passing: ${nearestExhibit.number}. ${nearestExhibit.title} (${nearestExhibit.location})`
                    : walkProgress < 0.21
                    ? 'Approaching the Carved Torana Gateway'
                    : 'Central Promenade · Hover any stop or 3D pedestal to preview'}
                </span>
              </div>

              {nearestExhibit && (
                <button
                  type="button"
                  onClick={() => onSelectExhibit(nearestExhibit.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#D8A845] text-[#140E0B] text-xs font-semibold hover:bg-[#E9BF5C] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Inspect Exhibit {nearestExhibit.number}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Interactive Promenade Path Rail: Gateway -> 01..09 -> Rotunda */}
            <nav aria-label="Museum Promenade Monument Path" className="relative flex items-center justify-between gap-1">
              {/* Connecting Path Line */}
              <div
                className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#E6B84D]/20 pointer-events-none"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-[#D8A845] transition-all duration-150"
                  style={{ width: `${Math.round(walkProgress * 100)}%` }}
                />
              </div>

              {/* Gateway Stop */}
              <button
                type="button"
                onClick={() => scrollToProgress(WALK_STOPS[0].progress)}
                className={`relative z-10 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
                  walkProgress < 0.21
                    ? 'bg-[#D8A845] text-[#140E0B] border-[#E9BF5C]'
                    : 'bg-[#1D1510] text-[#E5D9C3] border-[#E6B84D]/30 hover:border-[#E6B84D]'
                }`}
              >
                Gateway
              </button>

              {/* Nine Monument Stops */}
              <div className="relative z-10 flex items-center justify-between flex-1 px-1 sm:px-2 gap-1 overflow-x-auto">
                {EXHIBITS.map((exhibit, idx) => {
                  const stop = WALK_STOPS[idx + 1];
                  const isActive = nearestExhibitId === exhibit.id;
                  const isHovered = pathHoveredId === exhibit.id;
                  const isPassed = walkProgress >= stop.progress - 0.02;
                  return (
                    <button
                      key={exhibit.id}
                      type="button"
                      onClick={() => scrollToProgress(stop.progress)}
                      onMouseEnter={() => setPathHoveredId(exhibit.id)}
                      onMouseLeave={() => setPathHoveredId(null)}
                      onFocus={() => setPathHoveredId(exhibit.id)}
                      onBlur={() => setPathHoveredId(null)}
                      aria-label={`Walk to Exhibit ${exhibit.number}: ${exhibit.shortTitle}`}
                      className={`px-2 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all tabular-nums whitespace-nowrap shrink-0 border ${
                        isActive
                          ? 'bg-[#D8A845] text-[#140E0B] border-[#FAF5EA] scale-105'
                          : isHovered
                          ? 'bg-[#2C1F16] text-[#FAF5EA] border-[#E6B84D]'
                          : isPassed
                          ? 'bg-[#251A13] text-[#E6B84D] border-[#E6B84D]/45'
                          : 'bg-[#1A130F] text-[#CBB799] border-[#E6B84D]/25 hover:text-[#FAF5EA] hover:border-[#E6B84D]/60'
                      }`}
                    >
                      {exhibit.number}
                    </button>
                  );
                })}
              </div>

              {/* Rotunda End Stop */}
              <button
                type="button"
                onClick={() => scrollToProgress(WALK_STOPS[WALK_STOPS.length - 1].progress)}
                className={`relative z-10 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
                  walkProgress >= 0.92
                    ? 'bg-[#D8A845] text-[#140E0B] border-[#E9BF5C]'
                    : 'bg-[#1D1510] text-[#E5D9C3] border-[#E6B84D]/30 hover:border-[#E6B84D]'
                }`}
              >
                Rotunda
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
