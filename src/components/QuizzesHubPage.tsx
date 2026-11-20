import { useMemo, useState } from 'react';
import { Award, Check } from 'lucide-react';
import { EXHIBITS } from '../data/museumData';
import { ExhibitId } from '../types/museum';
import { buildMuseumChallengeQuestions } from '../utils/museumLogic';
import { QuizRunner } from './QuizRunner';

export function QuizzesHubPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<'challenge' | ExhibitId>('challenge');
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, string>>({});

  const challengeQuestions = useMemo(
    () => buildMuseumChallengeQuestions(EXHIBITS, 1),
    []
  );

  const activeExhibit =
    selectedQuiz === 'challenge'
      ? null
      : EXHIBITS.find((e) => e.id === selectedQuiz) ?? EXHIBITS[0];

  const handleComplete = (quizKey: string, score: number, total: number) => {
    setCompletedQuizzes((prev) => ({
      ...prev,
      [quizKey]: `${score}/${total}`,
    }));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Interactive Learning · 36 Questions Total
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-1.5">
          Museum Quizzes &amp; Final Challenge
        </h1>
        <p className="mt-3 text-base text-[#594335] max-w-2xl leading-relaxed">
          Test your knowledge from individual galleries or attempt the comprehensive Museum Challenge spanning all nine exhibits.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quiz Selector Sidebar */}
        <aside className="lg:col-span-4 space-y-3" aria-label="Select a museum quiz">
          <button
            type="button"
            onClick={() => setSelectedQuiz('challenge')}
            className={`w-full text-left rounded-xl border p-4 transition-colors ${
              selectedQuiz === 'challenge'
                ? 'bg-[#2A1E17] text-[#F8F4EC] border-[#2A1E17]'
                : 'bg-[#EFE7D8] text-[#2A1E17] border-[#2A1E17]/14 hover:bg-[#E5D9C3]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D8A845]">
                <Award className="w-4 h-4" />
                Featured Challenge
              </span>
              {completedQuizzes.challenge && (
                <span className="text-xs font-mono tabular-nums">
                  {completedQuizzes.challenge}
                </span>
              )}
            </div>
            <p className="font-display text-2xl font-semibold mt-1">
              The Grand Museum Challenge
            </p>
            <p
              className={`text-xs mt-1 ${
                selectedQuiz === 'challenge' ? 'text-[#E5D9C3]' : 'text-[#594335]'
              }`}
            >
              9 questions covering every exhibit from Stepwells to Mysorean Rockets.
            </p>
          </button>

          <div className="pt-2">
            <p className="text-xs uppercase tracking-widest text-[#78552B] mb-2">
              Individual Exhibit Quizzes
            </p>
            <div className="space-y-1.5">
              {EXHIBITS.map((ex) => {
                const isActive = selectedQuiz === ex.id;
                const scoreLabel = completedQuizzes[ex.id];
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedQuiz(ex.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#7C3F1E] text-[#F8F4EC] border-[#7C3F1E] font-medium'
                        : 'bg-[#F8F4EC] text-[#2A1E17] border-[#2A1E17]/14 hover:bg-[#EFE7D8]'
                    }`}
                  >
                    <span className="truncate">
                      {ex.number}. {ex.shortTitle}
                    </span>
                    {scoreLabel ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono shrink-0 tabular-nums">
                        <Check className="w-3.5 h-3.5" />
                        {scoreLabel}
                      </span>
                    ) : (
                      <span
                        className={`text-xs shrink-0 tabular-nums ${
                          isActive ? 'text-[#EFE7D8]' : 'text-[#78552B]'
                        }`}
                      >
                        {ex.quiz.length} Qs
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Active Quiz Stage */}
        <div className="lg:col-span-8">
          {selectedQuiz === 'challenge' ? (
            <QuizRunner
              key="museum-challenge"
              title="The Grand Museum Challenge"
              subtitle="One question from each of the nine permanent museum galleries (9 questions total)"
              questions={challengeQuestions}
              onComplete={(s, t) => handleComplete('challenge', s, t)}
            />
          ) : (
            activeExhibit && (
              <QuizRunner
                key={activeExhibit.id}
                title={`Exhibit ${activeExhibit.number}: ${activeExhibit.shortTitle}`}
                subtitle={`${activeExhibit.location} · ${activeExhibit.quiz.length} Questions`}
                questions={activeExhibit.quiz}
                onComplete={(s, t) => handleComplete(activeExhibit.id, s, t)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
