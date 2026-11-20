import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { KNOWLEDGE_CATEGORIES } from '../data/knowledgeCentre';
import { EXHIBITS } from '../data/museumData';
import { ExhibitId } from '../types/museum';
import { KnowledgeDiagram } from './KnowledgeDiagram';

interface KnowledgeCentrePageProps {
  onSelectExhibit: (id: ExhibitId) => void;
}

export function KnowledgeCentrePage({ onSelectExhibit }: KnowledgeCentrePageProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const visibleCategories =
    activeCategoryId === 'all'
      ? KNOWLEDGE_CATEGORIES
      : KNOWLEDGE_CATEGORIES.filter((c) => c.id === activeCategoryId);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Thematic Compendium · Seven Scientific Disciplines
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-1.5">
          Knowledge Centre
        </h1>
        <p className="mt-3 text-base text-[#594335] max-w-2xl leading-relaxed">
          Explore concise, beginner-friendly explanations and technical illustrations of the scientific ideas behind ancient Indian monuments and inventions.
        </p>
      </header>

      {/* Category Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter Knowledge Centre topics"
      >
        <button
          type="button"
          onClick={() => setActiveCategoryId('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeCategoryId === 'all'
              ? 'bg-[#2A1E17] text-[#F8F4EC]'
              : 'bg-[#EFE7D8] text-[#594335] hover:bg-[#E5D9C3]'
          }`}
        >
          All 7 Topics
        </button>
        {KNOWLEDGE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategoryId === cat.id
                ? 'bg-[#7C3F1E] text-[#F8F4EC]'
                : 'bg-[#EFE7D8] text-[#594335] hover:bg-[#E5D9C3]'
            }`}
          >
            {cat.number}. {cat.title}
          </button>
        ))}
      </div>

      {/* Category Cards */}
      <div className="space-y-8">
        {visibleCategories.map((cat) => (
          <section
            key={cat.id}
            aria-labelledby={`kc-${cat.id}`}
            className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/75 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <p className="text-xs font-mono text-[#78552B]">
                    Discipline {cat.number}
                  </p>
                  <h2
                    id={`kc-${cat.id}`}
                    className="font-display text-3xl font-semibold text-[#2A1E17] mt-1 leading-tight"
                  >
                    {cat.title}
                  </h2>
                  <p className="text-sm text-[#594335] mt-2 leading-relaxed">
                    {cat.summary}
                  </p>
                </div>

                <KnowledgeDiagram type={cat.diagramType} />
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#78552B] font-semibold">
                    How It Works
                  </h3>
                  <p className="text-base text-[#2A1E17] mt-2 leading-relaxed">
                    {cat.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#2A1E17]/12">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#78552B] font-semibold">
                      Key Scientific Principles
                    </h3>
                    <ul className="mt-2.5 space-y-2 text-sm text-[#594335] list-disc pl-5 leading-relaxed">
                      {cat.keyPrinciples.map((kp) => (
                        <li key={kp}>{kp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#78552B] font-semibold">
                      Interesting Facts
                    </h3>
                    <ul className="mt-2.5 space-y-2 text-sm text-[#594335] list-disc pl-5 leading-relaxed">
                      {cat.interestingFacts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Related 3D Exhibits */}
                <div className="pt-4 border-t border-[#2A1E17]/12 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium text-[#78552B]">
                    Related 3D Exhibits:
                  </span>
                  {cat.relatedExhibitIds.map((exId) => {
                    const ex = EXHIBITS.find((item) => item.id === exId);
                    if (!ex) return null;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => onSelectExhibit(ex.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/15 text-xs font-medium text-[#2A1E17] hover:bg-[#2A1E17] hover:text-[#F8F4EC] transition-colors"
                      >
                        <span>
                          {ex.number}. {ex.shortTitle}
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
