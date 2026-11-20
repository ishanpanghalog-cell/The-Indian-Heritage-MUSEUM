import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types/museum';
import { calculateQuizSummary, evaluateQuizAnswer } from '../utils/museumLogic';

interface QuizRunnerProps {
  title: string;
  subtitle?: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizRunner({ title, subtitle, questions, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion.id];
  const hasAnsweredCurrent = selectedOption !== undefined;
  const evaluation = hasAnsweredCurrent
    ? evaluateQuizAnswer(currentQuestion, selectedOption)
    : null;

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      const summary = calculateQuizSummary(questions, answers);
      onComplete?.(summary.correctCount, summary.totalCount);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setFinished(false);
  };

  if (finished) {
    const summary = calculateQuizSummary(questions, answers);
    return (
      <section
        aria-label={`${title} results`}
        className="rounded-xl border border-[#2A1E17]/15 bg-[#EFE7D8] p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-widest text-[#78552B]">
          Quiz Completed · Results Summary
        </p>
        <h3 className="font-display text-3xl font-semibold text-[#2A1E17] mt-1">
          {summary.curatorialRank}
        </h3>

        <div className="mt-5 flex flex-wrap items-baseline gap-6 border-y border-[#2A1E17]/12 py-4 tabular-nums">
          <div>
            <span className="text-xs text-[#594335] block">Final Score</span>
            <span className="font-display text-4xl font-semibold text-[#2A1E17]">
              {summary.correctCount} / {summary.totalCount}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#594335] block">Accuracy</span>
            <span className="font-display text-4xl font-semibold text-[#7C3F1E]">
              {summary.percentage}%
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-[#594335] leading-relaxed">
          {summary.percentage >= 75
            ? 'Excellent work! You have mastered the historical context and scientific engineering principles of this gallery.'
            : 'Good effort! Review the "The Science Behind It" notes or rotate the 3D model again, then retake the quiz to boost your score.'}
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-sm font-medium hover:bg-[#3F2E24] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={title}
      className="rounded-xl border border-[#2A1E17]/15 bg-[#EFE7D8] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A1E17]/12 pb-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#2A1E17]">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-[#594335] mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs font-mono text-[#594335] tabular-nums">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-[#78552B] mb-1.5">
          Topic: {currentQuestion.exhibitTitle}
        </p>
        <h4 className="text-base sm:text-lg font-semibold text-[#2A1E17] leading-snug">
          {currentQuestion.question}
        </h4>

        <div className="mt-4 grid grid-cols-1 gap-2.5" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let optionStyle =
              'bg-[#F8F4EC] border-[#2A1E17]/15 text-[#2A1E17] hover:bg-[#E5D9C3]/70';
            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'bg-[#E3EFE5] border-[#2E6B3E] text-[#1D4A29] font-medium';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-[#F8E4DF] border-[#9E3522] text-[#7A2314]';
              } else {
                optionStyle = 'bg-[#F8F4EC]/70 border-[#2A1E17]/10 text-[#594335]';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnsweredCurrent}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-start gap-3 ${optionStyle}`}
              >
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#2A1E17]/8 text-[#2A1E17] shrink-0 mt-0.5">
                  {OPTION_LETTERS[idx]}
                </span>
                <span className="text-sm leading-relaxed flex-1">{optionText}</span>
                {hasAnsweredCurrent && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B3E] shrink-0 mt-1" aria-label="Correct option" />
                )}
                {hasAnsweredCurrent && isSelected && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-[#9E3522] shrink-0 mt-1" aria-label="Incorrect option" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback & Scientific Explanation */}
        {evaluation && (
          <div
            className={`mt-5 rounded-lg border p-4 ${
              evaluation.isCorrect
                ? 'bg-[#E3EFE5]/80 border-[#2E6B3E]/40 text-[#1D4A29]'
                : 'bg-[#F8E4DF]/80 border-[#9E3522]/40 text-[#662013]'
            }`}
          >
            <p className="text-sm font-semibold">
              {evaluation.isCorrect ? 'Correct Answer' : 'Not Quite — Here Is Why'}
            </p>
            <p className="text-sm mt-1 leading-relaxed">{evaluation.explanation}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-xs font-semibold hover:bg-[#3F2E24] transition-colors"
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
