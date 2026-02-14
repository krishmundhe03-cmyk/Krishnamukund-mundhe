
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CUSTOM_TEST = 'CUSTOM_TEST',
  FORMULA_CARDS = 'FORMULA_CARDS',
  AI_TIME_TABLE = 'AI_TIME_TABLE',
  PYQ_BROWSER = 'PYQ_BROWSER'
}

export interface Question {
  id: number;
  type: 'MCQ' | 'NUMERICAL';
  questionText: string;
  options?: string[]; // Only for MCQ
  correctAnswer: string;
  solution: string;
}

export interface PracticeTest {
  subject: string;
  topic: string;
  questions: Question[];
}

export interface FormulaCard {
  title: string;
  formulas: string[];
  concepts: string[];
  reactions?: string[];
  proTip: string;
}

export interface ScheduleSlot {
  time: string;
  activity: string;
  subject: string;
  topic: string;
  type: 'Theory' | 'Practice' | 'Revision' | 'Break';
}

export interface TimeTable {
  title: string;
  description: string;
  schedule: ScheduleSlot[];
  tips: string[];
}

export interface AnalyticsData {
  accuracyTrend: { date: string; value: number }[];
  subjectMastery: { subject: string; value: number; color: string }[];
  weakAreas: { topic: string; subject: string; score: number }[];
}

export interface SavedTestTemplate {
  id: string;
  subject: string;
  topic: string;
  examLevel: string;
  count: number;
}

export interface PYQSolution {
  underlyingConcept: string;
  mathematicalDerivation: string;
  proTip: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  subject: string;
  rank: number;
}
