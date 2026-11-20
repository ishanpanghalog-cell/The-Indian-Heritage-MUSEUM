import { useEffect, useMemo, useState } from 'react';
import { AboutMuseumPage } from './components/AboutMuseumPage';
import { ExhibitDetailPage } from './components/ExhibitDetailPage';
import { ExploreExhibitsPage } from './components/ExploreExhibitsPage';
import { KnowledgeCentrePage } from './components/KnowledgeCentrePage';
import { MuseumHallPage } from './components/MuseumHallPage';
import { MuseumHeader } from './components/MuseumHeader';
import { QuizzesHubPage } from './components/QuizzesHubPage';
import { VisitorGuidePage } from './components/VisitorGuidePage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { EXHIBITS } from './data/museumData';
import { ExhibitId, MuseumView } from './types/museum';
import {
  calculateExplorationProgress,
  getBreadcrumbTrail,
  markExhibitExplored,
} from './utils/museumLogic';

interface HistoryEntry {
  view: MuseumView;
  exhibitId?: ExhibitId;
}

const STORAGE_KEY = 'ihm_explored_exhibits_v1';

function getInitialView(): MuseumView {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'hall';
    }
  }
  return 'welcome';
}

function loadInitialExplored(): ExhibitId[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is ExhibitId =>
        EXHIBITS.some((ex) => ex.id === id)
      );
    }
  } catch {
    // ignore storage access issues
  }
  return [];
}

export default function App() {
  const [view, setView] = useState<MuseumView>(getInitialView);
  const [activeExhibitId, setActiveExhibitId] = useState<ExhibitId>('water-lab');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exploredIds, setExploredIds] = useState<ExhibitId[]>(loadInitialExplored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(exploredIds));
    } catch {
      // ignore storage errors
    }
  }, [exploredIds]);

  useEffect(() => {
    document.body.dataset.museumView = view;
  }, [view]);

  const navigateTo = (nextView: MuseumView, exhibitId?: ExhibitId) => {
    if (nextView === view && (!exhibitId || exhibitId === activeExhibitId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view !== 'welcome') {
      setHistory((prev) => [...prev.slice(-15), { view, exhibitId: activeExhibitId }]);
    }

    if (exhibitId) {
      setActiveExhibitId(exhibitId);
      setExploredIds((prev) => markExhibitExplored(prev, exhibitId));
    }

    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectExhibit = (id: ExhibitId) => {
    navigateTo('exhibit-detail', id);
  };

  const handleBack = () => {
    if (history.length === 0) {
      navigateTo('hall');
      return;
    }
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    if (previous.exhibitId) {
      setActiveExhibitId(previous.exhibitId);
    }
    setView(previous.view);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const breadcrumbs = useMemo(
    () => getBreadcrumbTrail(view, EXHIBITS, activeExhibitId),
    [view, activeExhibitId]
  );

  const progress = useMemo(
    () => calculateExplorationProgress(exploredIds, EXHIBITS.length),
    [exploredIds]
  );

  const activeExhibit = useMemo(
    () => EXHIBITS.find((e) => e.id === activeExhibitId) ?? EXHIBITS[0],
    [activeExhibitId]
  );

  if (view === 'welcome') {
    return (
      <WelcomeScreen
        exploredIds={exploredIds}
        onEnterMuseum={() => navigateTo('hall')}
        onOpenGuide={() => navigateTo('guide')}
        onSelectExhibit={handleSelectExhibit}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#2A1E17]">
      <MuseumHeader
        currentView={view}
        breadcrumbs={breadcrumbs}
        exploredCount={progress.count}
        totalExhibits={progress.total}
        canGoBack={history.length > 0 || view !== 'hall'}
        onNavigate={(v, id) => navigateTo(v, id)}
        onBack={handleBack}
      />

      <main className="flex-1">
        {view === 'hall' && (
          <MuseumHallPage
            exploredIds={exploredIds}
            onSelectExhibit={handleSelectExhibit}
            onNavigate={(v) => navigateTo(v)}
          />
        )}

        {view === 'exhibits' && (
          <ExploreExhibitsPage
            exploredIds={exploredIds}
            onSelectExhibit={handleSelectExhibit}
          />
        )}

        {view === 'exhibit-detail' && (
          <ExhibitDetailPage
            exhibit={activeExhibit}
            onSelectExhibit={handleSelectExhibit}
            onReturnToHall={() => navigateTo('hall')}
          />
        )}

        {view === 'guide' && (
          <VisitorGuidePage onNavigate={(v) => navigateTo(v)} />
        )}

        {view === 'knowledge' && (
          <KnowledgeCentrePage onSelectExhibit={handleSelectExhibit} />
        )}

        {view === 'quizzes' && <QuizzesHubPage />}

        {view === 'about' && (
          <AboutMuseumPage onNavigate={(v) => navigateTo(v)} />
        )}
      </main>

      <footer className="border-t border-[#2A1E17]/14 bg-[#EFE7D8]/70 mt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#594335]">
          <div>
            <p className="font-display text-base font-semibold text-[#2A1E17]">
              The Indian Heritage &amp; Ancient Science Museum
            </p>
            <p className="mt-0.5">
              Explore the knowledge of the past. Discover the innovations of ancient India.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('hall')}
              className="hover:text-[#2A1E17] underline underline-offset-2"
            >
              Main Hall
            </button>
            <button
              type="button"
              onClick={() => navigateTo('guide')}
              className="hover:text-[#2A1E17] underline underline-offset-2"
            >
              Visitor Guide
            </button>
            <button
              type="button"
              onClick={() => navigateTo('knowledge')}
              className="hover:text-[#2A1E17] underline underline-offset-2"
            >
              Knowledge Centre
            </button>
            <button
              type="button"
              onClick={() => navigateTo('quizzes')}
              className="hover:text-[#2A1E17] underline underline-offset-2"
            >
              Quizzes
            </button>
            <button
              type="button"
              onClick={() => navigateTo('welcome')}
              className="hover:text-[#2A1E17] underline underline-offset-2"
            >
              Museum Entrance
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
