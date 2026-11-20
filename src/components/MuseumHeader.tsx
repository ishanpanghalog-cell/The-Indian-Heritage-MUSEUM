import { useState } from 'react';
import { ArrowLeft, ChevronRight, Home, Menu, X } from 'lucide-react';
import { BreadcrumbItem } from '../utils/museumLogic';
import { ExhibitId, MuseumView } from '../types/museum';

interface MuseumHeaderProps {
  currentView: MuseumView;
  breadcrumbs: BreadcrumbItem[];
  exploredCount: number;
  totalExhibits: number;
  canGoBack: boolean;
  onNavigate: (view: MuseumView, exhibitId?: ExhibitId) => void;
  onBack: () => void;
}

const NAV_ITEMS: { label: string; view: MuseumView }[] = [
  { label: 'Home', view: 'hall' },
  { label: 'Explore Exhibits', view: 'exhibits' },
  { label: 'Visitor Guide', view: 'guide' },
  { label: 'Knowledge Centre', view: 'knowledge' },
  { label: 'About the Museum', view: 'about' },
];

export function MuseumHeader({
  currentView,
  breadcrumbs,
  exploredCount,
  totalExhibits,
  canGoBack,
  onNavigate,
  onBack,
}: MuseumHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view: MuseumView, exhibitId?: ExhibitId) => {
    setMobileOpen(false);
    onNavigate(view, exhibitId);
  };

  return (
    <div className="bg-[#F8F4EC] border-b border-[#2A1E17]/14">
      <header className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('hall')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#2A1E17] hover:text-[#7C3F1E] transition-colors whitespace-nowrap shrink-0 text-left"
        >
          The Indian Heritage Museum
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Museum Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#594335]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'exhibits' && currentView === 'exhibit-detail');
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'text-[#2A1E17] border-[#A6791E]'
                    : 'border-transparent hover:text-[#2A1E17] hover:border-[#2A1E17]/25'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Quizzes) + mobile drawer toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('quizzes')}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'quizzes'
                ? 'bg-[#2A1E17] text-[#F8F4EC]'
                : 'bg-[#7C3F1E] text-[#F8F4EC] hover:bg-[#663317]'
            }`}
          >
            Quizzes
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-lg border border-[#2A1E17]/15 text-[#2A1E17] hover:bg-[#EFE7D8]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Museum Navigation"
          className="lg:hidden border-t border-[#2A1E17]/10 bg-[#EFE7D8] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'exhibits' && currentView === 'exhibit-detail');
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#2A1E17] text-[#F8F4EC]'
                    : 'text-[#2A1E17] hover:bg-[#E5D9C3]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('quizzes')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold mt-1 ${
              currentView === 'quizzes'
                ? 'bg-[#2A1E17] text-[#F8F4EC]'
                : 'bg-[#7C3F1E] text-[#F8F4EC]'
            }`}
          >
            Quizzes
          </button>
        </nav>
      )}

      {/* Sub-bar: Breadcrumbs, Back/Home Controls & Exploration Progress */}
      <div className="bg-[#EFE7D8]/75 border-t border-[#2A1E17]/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {canGoBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#2A1E17]/15 bg-[#F8F4EC] text-[#2A1E17] hover:bg-[#E5D9C3] transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentView !== 'hall' && (
              <button
                type="button"
                onClick={() => handleNav('hall')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#2A1E17]/15 bg-[#F8F4EC] text-[#2A1E17] hover:bg-[#E5D9C3] transition-colors whitespace-nowrap shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Main Hall</span>
              </button>
            )}

            <ol className="flex flex-wrap items-center gap-1 text-[#594335]" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.view}-${idx}`} className="flex items-center gap-1">
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#78552B]/60" aria-hidden="true" />}
                    {isLast ? (
                      <span className="font-medium text-[#2A1E17] truncate max-w-[200px] sm:max-w-none">
                        {crumb.label}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNav(crumb.view, crumb.exhibitId)}
                        className="hover:text-[#2A1E17] underline decoration-[#2A1E17]/25 underline-offset-2 whitespace-nowrap"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[#594335] tabular-nums">
            <span>
              Gallery Progress: <strong className="text-[#2A1E17]">{exploredCount}/{totalExhibits}</strong> Explored
            </span>
            <div
              className="hidden sm:block w-24 h-1.5 bg-[#2A1E17]/15 rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-[#A6791E] transition-all duration-300"
                style={{ width: `${Math.round((exploredCount / Math.max(1, totalExhibits)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
