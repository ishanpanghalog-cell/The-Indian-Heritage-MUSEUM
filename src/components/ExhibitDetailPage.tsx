import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { EXHIBITS } from '../data/museumData';
import { ExhibitData, ExhibitId } from '../types/museum';
import { getAdjacentExhibits } from '../utils/museumLogic';
import { QuizRunner } from './QuizRunner';
import { ExhibitViewer3D } from './three/ExhibitViewer3D';

interface ExhibitDetailPageProps {
  exhibit: ExhibitData;
  onSelectExhibit: (id: ExhibitId) => void;
  onReturnToHall: () => void;
}

export function ExhibitDetailPage({
  exhibit,
  onSelectExhibit,
  onReturnToHall,
}: ExhibitDetailPageProps) {
  const adjacent = getAdjacentExhibits(EXHIBITS, exhibit.id);

  return (
    <article className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      {/* Exhibit Accession Header */}
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Exhibit {exhibit.number} · {exhibit.galleryWing} · {exhibit.accessionNumber}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-2 leading-tight">
          {exhibit.title}
        </h1>
        <p className="font-display italic text-xl text-[#594335] mt-1.5">
          {exhibit.subtitle}
        </p>

        {/* Clean Unboxed Metadata Strip */}
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#2A1E17]/12 pt-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-[#78552B]">Location</dt>
            <dd className="font-medium text-[#2A1E17] mt-0.5">{exhibit.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-[#78552B]">Historical Period</dt>
            <dd className="font-medium text-[#2A1E17] mt-0.5">{exhibit.period}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-[#78552B]">Patronage / Tradition</dt>
            <dd className="font-medium text-[#2A1E17] mt-0.5">{exhibit.dynastyOrCulture}</dd>
          </div>
        </dl>
      </header>

      {/* Interactive 3D Exhibition Stage */}
      <section aria-label="Interactive 3D Exhibit Model" className="space-y-2.5">
        <ExhibitViewer3D exhibit={exhibit} />
        <p className="text-xs text-[#594335]">
          Interactive 3D Controls: Drag to rotate 360°, scroll or use +/- buttons to zoom, switch between standard, cross-section, and animated modes below the model, or click numbered pins to inspect structural details.
        </p>
      </section>

      {/* Curatorial Verification / Evidence Note when applicable */}
      {exhibit.curatorialNote && (
        <aside
          aria-label="Curatorial Historical Note"
          className="rounded-xl border border-[#A6791E]/45 bg-[#EFE7D8] p-5"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-[#7C3F1E]">
            Curatorial Accuracy Note
          </p>
          <p className="text-sm text-[#2A1E17] mt-1.5 leading-relaxed">
            {exhibit.curatorialNote}
          </p>
        </aside>
      )}

      {/* Main Two-Column Editorial Reading Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left/Main Reading Column */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-3">
            <h2 className="font-display text-3xl font-semibold text-[#2A1E17]">
              Historical Introduction
            </h2>
            <p className="text-base text-[#2A1E17]/90 leading-[1.78] first-letter:text-5xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#7C3F1E]">
              {exhibit.historicalIntro}
            </p>
          </section>

          <section className="space-y-3 border-t border-[#2A1E17]/12 pt-6">
            <h2 className="font-display text-3xl font-semibold text-[#2A1E17]">
              Architectural &amp; Engineering Significance
            </h2>
            <p className="text-base text-[#594335] leading-relaxed">
              {exhibit.significance}
            </p>
          </section>

          {/* Required Section: The Science Behind It */}
          <section
            aria-labelledby="science-behind-heading"
            className="rounded-xl border border-[#2A1E17]/15 bg-[#EFE7D8]/85 p-6 sm:p-7 space-y-4"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#78552B]">
                Scientific Analysis
              </p>
              <h2
                id="science-behind-heading"
                className="font-display text-3xl font-semibold text-[#2A1E17] mt-1"
              >
                {exhibit.scienceBehindIt.heading}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#2A1E17] leading-relaxed">
              {exhibit.scienceBehindIt.summary}
            </p>
            <div className="space-y-4 pt-2">
              {exhibit.scienceBehindIt.principles.map((p, idx) => (
                <div
                  key={p.title}
                  className="pt-3 border-t border-[#2A1E17]/12"
                >
                  <h3 className="text-sm font-semibold text-[#7C3F1E]">
                    0{idx + 1}. {p.title}
                  </h3>
                  <p className="text-sm text-[#594335] mt-1 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Margin Column: Archival Photo, Features, Interesting Facts */}
        <aside className="lg:col-span-5 space-y-6">
          {exhibit.archivalImage && (
            <figure className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8] overflow-hidden">
              <img
                src={exhibit.archivalImage}
                alt={exhibit.archivalCaption ?? exhibit.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
              {exhibit.archivalCaption && (
                <figcaption className="px-4 py-3 text-xs font-display italic text-[#594335]">
                  {exhibit.archivalCaption}
                </figcaption>
              )}
            </figure>
          )}

          <section className="rounded-xl border border-[#2A1E17]/14 bg-[#F8F4EC] p-6 space-y-3">
            <h2 className="font-display text-2xl font-semibold text-[#2A1E17]">
              Important Features
            </h2>
            <ul className="space-y-2.5 text-sm text-[#594335] leading-relaxed list-disc pl-5">
              {exhibit.importantFeatures.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/70 p-6 space-y-3">
            <h2 className="font-display text-2xl font-semibold text-[#2A1E17]">
              Interesting Facts
            </h2>
            <ul className="space-y-2.5 text-sm text-[#594335] leading-relaxed list-disc pl-5">
              {exhibit.interestingFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* Exhibit Knowledge Quiz */}
      <section aria-label="Exhibit Quiz" className="pt-2">
        <QuizRunner
          key={exhibit.id}
          title={`${exhibit.shortTitle} — Knowledge Quiz`}
          subtitle={`Test what you discovered in Exhibit ${exhibit.number} (${exhibit.quiz.length} questions)`}
          questions={exhibit.quiz}
        />
      </section>

      {/* Bottom Gallery Navigation: Prev, Return to Main Hall, Next */}
      <nav
        aria-label="Exhibit Gallery Sequence"
        className="border-t border-[#2A1E17]/14 pt-6 flex flex-wrap items-center justify-between gap-4"
      >
        {adjacent ? (
          <button
            type="button"
            onClick={() => onSelectExhibit(adjacent.prev.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A1E17]/20 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: {adjacent.prev.shortTitle}</span>
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onReturnToHall}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-sm font-semibold hover:bg-[#3F2E24] transition-colors"
        >
          <Home className="w-4 h-4 text-[#D8A845]" />
          <span>Back to Main Hall</span>
        </button>

        {adjacent && (
          <button
            type="button"
            onClick={() => onSelectExhibit(adjacent.next.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A1E17]/20 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors"
          >
            <span>Next: {adjacent.next.shortTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </nav>
    </article>
  );
}
