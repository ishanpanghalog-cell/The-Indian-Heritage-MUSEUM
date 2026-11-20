import { ExhibitData, ExhibitId, MuseumView, QuizQuestion } from '../types/museum';

export interface BreadcrumbItem {
  label: string;
  view: MuseumView;
  exhibitId?: ExhibitId;
}

export interface QuizSummary {
  correctCount: number;
  totalCount: number;
  percentage: number;
  curatorialRank: string;
}

export function calculateExplorationProgress(
  exploredIds: readonly ExhibitId[],
  totalExhibits: number
): { count: number; total: number; percentage: number } {
  const uniqueCount = new Set(exploredIds).size;
  const clampedTotal = Math.max(1, totalExhibits);
  const clampedCount = Math.min(uniqueCount, clampedTotal);
  return {
    count: clampedCount,
    total: clampedTotal,
    percentage: Math.round((clampedCount / clampedTotal) * 100),
  };
}

export function markExhibitExplored(
  exploredIds: readonly ExhibitId[],
  exhibitId: ExhibitId
): ExhibitId[] {
  if (exploredIds.includes(exhibitId)) {
    return [...exploredIds];
  }
  return [...exploredIds, exhibitId];
}

export function getAdjacentExhibits(
  exhibits: readonly ExhibitData[],
  currentId: ExhibitId
): { prev: ExhibitData; next: ExhibitData; currentIndex: number } | null {
  const index = exhibits.findIndex((item) => item.id === currentId);
  if (index === -1 || exhibits.length === 0) return null;
  const prevIndex = (index - 1 + exhibits.length) % exhibits.length;
  const nextIndex = (index + 1) % exhibits.length;
  return {
    prev: exhibits[prevIndex],
    next: exhibits[nextIndex],
    currentIndex: index,
  };
}

export function getBreadcrumbTrail(
  view: MuseumView,
  exhibits: readonly ExhibitData[],
  activeExhibitId?: ExhibitId
): BreadcrumbItem[] {
  const base: BreadcrumbItem[] = [{ label: 'Main Hall', view: 'hall' }];

  switch (view) {
    case 'welcome':
      return [{ label: 'Entrance', view: 'welcome' }];
    case 'hall':
      return base;
    case 'exhibits':
      return [...base, { label: 'Explore Exhibits', view: 'exhibits' }];
    case 'exhibit-detail': {
      const exhibit = exhibits.find((e) => e.id === activeExhibitId);
      return [
        ...base,
        { label: 'Explore Exhibits', view: 'exhibits' },
        {
          label: exhibit ? `${exhibit.number}. ${exhibit.shortTitle}` : 'Exhibit',
          view: 'exhibit-detail',
          exhibitId: activeExhibitId,
        },
      ];
    }
    case 'guide':
      return [...base, { label: 'Visitor Guide', view: 'guide' }];
    case 'knowledge':
      return [...base, { label: 'Knowledge Centre', view: 'knowledge' }];
    case 'quizzes':
      return [...base, { label: 'Quizzes & Challenge', view: 'quizzes' }];
    case 'about':
      return [...base, { label: 'About the Museum', view: 'about' }];
    default:
      return base;
  }
}

export function evaluateQuizAnswer(
  question: QuizQuestion,
  selectedIndex: number
): { isCorrect: boolean; correctIndex: number; explanation: string } {
  return {
    isCorrect: selectedIndex === question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

export function calculateQuizSummary(
  questions: readonly QuizQuestion[],
  answersByQuestionId: Record<string, number>
): QuizSummary {
  const totalCount = questions.length;
  if (totalCount === 0) {
    return {
      correctCount: 0,
      totalCount: 0,
      percentage: 0,
      curatorialRank: 'Museum Visitor',
    };
  }

  let correctCount = 0;
  for (const q of questions) {
    if (answersByQuestionId[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  }
  const percentage = Math.round((correctCount / totalCount) * 100);

  let curatorialRank = 'Curious Apprentice';
  if (percentage === 100) {
    curatorialRank = 'Master Heritage Scholar';
  } else if (percentage >= 75) {
    curatorialRank = 'Senior Science Curator';
  } else if (percentage >= 50) {
    curatorialRank = 'Gallery Explorer';
  }

  return {
    correctCount,
    totalCount,
    percentage,
    curatorialRank,
  };
}

export function buildMuseumChallengeQuestions(
  exhibits: readonly ExhibitData[],
  questionsPerExhibit = 1
): QuizQuestion[] {
  const selected: QuizQuestion[] = [];
  for (const exhibit of exhibits) {
    const slice = exhibit.quiz.slice(0, questionsPerExhibit);
    selected.push(...slice);
  }
  return selected;
}

export function filterExhibitsByQuery(
  exhibits: readonly ExhibitData[],
  query: string
): ExhibitData[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...exhibits];
  return exhibits.filter(
    (ex) =>
      ex.title.toLowerCase().includes(normalized) ||
      ex.location.toLowerCase().includes(normalized) ||
      ex.shortDescription.toLowerCase().includes(normalized) ||
      ex.galleryWing.toLowerCase().includes(normalized)
  );
}
