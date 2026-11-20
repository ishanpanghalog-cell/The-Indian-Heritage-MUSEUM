import test from 'node:test';
import assert from 'node:assert/strict';
import { EXHIBITS } from '../data/museumData';
import {
  buildMuseumChallengeQuestions,
  calculateExplorationProgress,
  calculateQuizSummary,
  evaluateQuizAnswer,
  filterExhibitsByQuery,
  getAdjacentExhibits,
  getBreadcrumbTrail,
  markExhibitExplored,
} from './museumLogic';

test('exploration progress tracks unique exhibits and clamps bounds', () => {
  const initial = calculateExplorationProgress([], 9);
  assert.deepEqual(initial, { count: 0, total: 9, percentage: 0 });

  const updated = markExhibitExplored(['water-lab'], 'gol-gumbaz');
  assert.deepEqual(updated, ['water-lab', 'gol-gumbaz']);

  const duplicate = markExhibitExplored(updated, 'water-lab');
  assert.equal(duplicate.length, 2);

  const progress = calculateExplorationProgress(duplicate, 9);
  assert.deepEqual(progress, { count: 2, total: 9, percentage: 22 });
});

test('adjacent exhibit navigation wraps cleanly around all 9 exhibits', () => {
  const first = getAdjacentExhibits(EXHIBITS, 'water-lab');
  assert.ok(first);
  assert.equal(first.prev.id, 'mysorean-rockets');
  assert.equal(first.next.id, 'brihadeeswarar');

  const last = getAdjacentExhibits(EXHIBITS, 'mysorean-rockets');
  assert.ok(last);
  assert.equal(last.prev.id, 'living-root-bridges');
  assert.equal(last.next.id, 'water-lab');
});

test('breadcrumbs always build deterministic path from Main Hall', () => {
  const trail = getBreadcrumbTrail('exhibit-detail', EXHIBITS, 'gol-gumbaz');
  assert.equal(trail.length, 3);
  assert.equal(trail[0].label, 'Main Hall');
  assert.equal(trail[1].label, 'Explore Exhibits');
  assert.equal(trail[2].label, '04. Gol Gumbaz');
});

test('quiz evaluation and Museum Challenge assembly cover all 9 exhibits', () => {
  const challenge = buildMuseumChallengeQuestions(EXHIBITS, 1);
  assert.equal(challenge.length, 9);

  const q0 = challenge[0];
  const rightResult = evaluateQuizAnswer(q0, q0.correctIndex);
  assert.equal(rightResult.isCorrect, true);

  const wrongIdx = (q0.correctIndex + 1) % 4;
  const wrongResult = evaluateQuizAnswer(q0, wrongIdx);
  assert.equal(wrongResult.isCorrect, false);

  const answers: Record<string, number> = {};
  challenge.forEach((q) => {
    answers[q.id] = q.correctIndex;
  });
  const summary = calculateQuizSummary(challenge, answers);
  assert.equal(summary.correctCount, 9);
  assert.equal(summary.percentage, 100);
  assert.equal(summary.curatorialRank, 'Master Heritage Scholar');
});

test('filterExhibitsByQuery filters by location, title, or topic', () => {
  const kashmir = filterExhibitsByQuery(EXHIBITS, 'Kashmir');
  assert.equal(kashmir.length, 1);
  assert.equal(kashmir[0].id, 'martand-sun');

  const all = filterExhibitsByQuery(EXHIBITS, '   ');
  assert.equal(all.length, 9);
});
