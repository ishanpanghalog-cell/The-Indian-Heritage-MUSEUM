import { useState } from 'react';
import { ArrowRight, Check, Search } from 'lucide-react';
import { EXHIBITS } from '../data/museumData';
import { ExhibitId } from '../types/museum';
import { filterExhibitsByQuery } from '../utils/museumLogic';

interface ExploreExhibitsPageProps {
  exploredIds: ExhibitId[];
  onSelectExhibit: (id: ExhibitId) => void;
}

export function ExploreExhibitsPage({
  exploredIds,
  onSelectExhibit,
}: ExploreExhibitsPageProps) {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'explored' | 'unvisited'>('all');

  const searched = filterExhibitsByQuery(EXHIBITS, query);
  const filtered = searched.filter((ex) => {
    const visited = exploredIds.includes(ex.id);
    if (filterMode === 'explored') return visited;
    if (filterMode === 'unvisited') return !visited;
    return true;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Curatorial Archive
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-1.5">
          Explore All Nine Exhibits
        </h1>
        <p className="mt-2 text-base text-[#594335] max-w-2xl">
          Search by monument name, state, or scientific discipline to enter any 3D gallery directly.
        </p>
      </header>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#78552B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <label htmlFor="exhibit-search" className="sr-only">
            Search exhibits by name or location
          </label>
          <input
            id="exhibit-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by monument, state, or topic (e.g. Kashmir, rockets)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#2A1E17]/18 bg-[#F8F4EC] text-sm text-[#2A1E17] placeholder:text-[#78552B]/65"
          />
        </div>

        <div
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#EFE7D8] border border-[#2A1E17]/12 self-start"
          role="group"
          aria-label="Filter exhibits by exploration status"
        >
          {(
            [
              { id: 'all', label: 'All (9)' },
              { id: 'explored', label: `Explored (${exploredIds.length})` },
              { id: 'unvisited', label: `Unvisited (${EXHIBITS.length - exploredIds.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                filterMode === tab.id
                  ? 'bg-[#2A1E17] text-[#F8F4EC]'
                  : 'text-[#594335] hover:text-[#2A1E17]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8] p-10 text-center">
          <p className="font-display text-2xl text-[#2A1E17]">No matching exhibits found</p>
          <p className="text-sm text-[#594335] mt-1">
            Try clearing your search term or switching the filter to All.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilterMode('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exhibit) => {
            const visited = exploredIds.includes(exhibit.id);
            return (
              <article
                key={exhibit.id}
                className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/80 overflow-hidden flex flex-col justify-between hover:border-[#A6791E]/60 transition-colors"
              >
                <div>
                  {exhibit.archivalImage && (
                    <div className="relative h-40 bg-[#1B1410] overflow-hidden border-b border-[#2A1E17]/12">
                      <img
                        src={exhibit.archivalImage}
                        alt={exhibit.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-95"
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1B1410]/80 to-transparent"
                        aria-hidden="true"
                      />
                      <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-xs text-[#F8F4EC]">
                        <span className="font-mono">Exhibit {exhibit.number}</span>
                        {visited && (
                          <span className="inline-flex items-center gap-1 text-[#D8A845] font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Visited
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-5 pb-0">
                    <div className="flex items-center justify-between text-xs text-[#78552B]">
                      <span className="font-mono">{exhibit.accessionNumber}</span>
                      {!exhibit.archivalImage && visited && (
                        <span className="inline-flex items-center gap-1 text-[#2E6B3E] font-medium">
                          <Check className="w-3.5 h-3.5" />
                          Visited
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-[#2A1E17] mt-1.5 leading-snug">
                      {exhibit.title}
                    </h2>
                    <p className="text-xs text-[#594335] mt-1">
                      {exhibit.location} · {exhibit.period}
                    </p>
                    <p className="text-sm text-[#594335] mt-2.5 leading-relaxed">
                      {exhibit.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-4 mt-4 border-t border-[#2A1E17]/10 flex items-center justify-between">
                  <span className="text-xs text-[#78552B]">{exhibit.modes.length} 3D Modes</span>
                  <button
                    type="button"
                    onClick={() => onSelectExhibit(exhibit.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-xs font-semibold hover:bg-[#7C3F1E] transition-colors"
                  >
                    <span>Explore Exhibit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
