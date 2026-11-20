import { ArrowRight, BookOpen, Check, Compass, Footprints } from 'lucide-react';
import { EXHIBITS, MUSEUM_ASSETS } from '../data/museumData';
import { ExhibitId, MuseumView } from '../types/museum';
import { MuseumHallCanvas } from './three/MuseumHallCanvas';

interface MuseumHallPageProps {
  exploredIds: ExhibitId[];
  onSelectExhibit: (id: ExhibitId) => void;
  onNavigate: (view: MuseumView) => void;
}

export function MuseumHallPage({
  exploredIds,
  onSelectExhibit,
  onNavigate,
}: MuseumHallPageProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
      {/* Museum Hall Welcome Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#2A1E17]/14 pb-8">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
            Main Museum Rotunda · Nine Galleries
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-2 leading-tight">
            The Indian Heritage &amp; Ancient Science Museum
          </h1>
          <p className="mt-3 text-base text-[#594335] max-w-2xl leading-relaxed">
            Welcome to the Central Rotunda. Hover over any pedestal or path stop below to preview a monument, or click to explore its interactive 3D engineering model and scientific quizzes.
          </p>
        </div>

        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#A6791E]/45 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors whitespace-nowrap"
          >
            <Footprints className="w-4 h-4 text-[#A6791E]" />
            <span>Entrance Walk</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('guide')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A1E17]/20 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-[#7C3F1E]" />
            <span>Visitor Guide</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('knowledge')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-sm font-medium hover:bg-[#3F2E24] transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-[#D8A845]" />
            <span>Knowledge Centre</span>
          </button>
        </div>
      </section>

      {/* Large Central 3D Museum Interior */}
      <section aria-label="Interactive 3D Main Museum Hall">
        <MuseumHallCanvas exploredIds={exploredIds} onSelectExhibit={onSelectExhibit} />
      </section>

      {/* Nine Permanent Exhibit Displays */}
      <section aria-labelledby="hall-exhibits-heading" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2A1E17]/14 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#78552B]">
              Permanent Collection
            </p>
            <h2
              id="hall-exhibits-heading"
              className="font-display text-3xl sm:text-4xl font-semibold text-[#2A1E17] mt-1"
            >
              Nine Museum Exhibits
            </h2>
          </div>
          <p className="text-sm text-[#594335] tabular-nums">
            {exploredIds.length} of {EXHIBITS.length} galleries visited
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXHIBITS.map((exhibit) => {
            const isExplored = exploredIds.includes(exhibit.id);
            return (
              <article
                key={exhibit.id}
                className="flex flex-col justify-between rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/75 overflow-hidden hover:border-[#A6791E]/60 transition-colors"
              >
                {/* Visual Exhibit Plinth Header / Photo */}
                <div className="relative h-44 bg-[#211812] overflow-hidden border-b border-[#2A1E17]/12">
                  {exhibit.archivalImage ? (
                    <img
                      src={exhibit.archivalImage}
                      alt={exhibit.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col justify-between p-5"
                      style={{
                        background: `radial-gradient(circle at 75% 25%, ${exhibit.accentColor}55 0%, #1B1410 72%)`,
                      }}
                    >
                      <span className="font-mono text-xs text-[#D8A845]">
                        {exhibit.accessionNumber}
                      </span>
                      <div>
                        <p className="font-display text-2xl text-[#F8F4EC] leading-tight">
                          {exhibit.shortTitle}
                        </p>
                        <p className="text-xs text-[#E5D9C3]/80 mt-1">
                          Interactive 3D Architectural Model
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1B1410]/85 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#F8F4EC]">
                    <span className="font-mono tracking-wider">Exhibit {exhibit.number}</span>
                    {isExplored && (
                      <span className="inline-flex items-center gap-1 text-[#D8A845] font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Explored
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Copy */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#78552B] truncate">
                      {exhibit.location} · {exhibit.period}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#2A1E17] mt-1.5 leading-snug">
                      {exhibit.title}
                    </h3>
                    <p className="text-sm text-[#594335] mt-2 leading-relaxed">
                      {exhibit.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#2A1E17]/10 flex items-center justify-between">
                    <span className="text-xs text-[#594335]">
                      {exhibit.quiz.length} Quiz Questions
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectExhibit(exhibit.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-xs font-semibold hover:bg-[#7C3F1E] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Explore Exhibit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Architectural Rotunda Spotlight Strip */}
      <section className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-5 min-h-[220px] bg-[#211812]">
          <img
            src={MUSEUM_ASSETS.grandHall}
            alt="Warm sandstone rotunda hall inside the Indian Heritage Museum"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-[#78552B]">
            Ready for the Final Challenge?
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#2A1E17] mt-1.5">
            Test Your Knowledge Across All Nine Exhibits
          </h2>
          <p className="text-sm text-[#594335] mt-2.5 leading-relaxed max-w-xl">
            Visit the Quizzes section to take the 9-question Museum Challenge, or study the underlying physics, hydrology, and geometry in our Knowledge Centre.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('quizzes')}
              className="px-5 py-2.5 rounded-lg bg-[#7C3F1E] text-[#F8F4EC] text-sm font-semibold hover:bg-[#663317] transition-colors"
            >
              Take the Museum Challenge
            </button>
            <button
              type="button"
              onClick={() => onNavigate('knowledge')}
              className="px-5 py-2.5 rounded-lg border border-[#2A1E17]/20 bg-[#F8F4EC] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors"
            >
              Browse Knowledge Centre
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
