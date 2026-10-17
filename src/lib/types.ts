export const LIMITS = {
  name: 40,
  question: 140,
  choice: 80,
  minQuestions: 3,
  maxQuestions: 20,
  minChoices: 2,
  maxChoices: 4,
};

export type QuestionDraft = {
  text: string;
  choices: string[];
  correctIndex: number;
};

// Ce que voit un joueur : jamais la bonne réponse.
export type PublicQuestion = {
  id: string;
  text: string;
  choices: string[];
};

export type PublicQuiz = {
  slug: string;
  ownerName: string;
  questions: PublicQuestion[];
};

export type LeaderboardEntry = {
  playerName: string;
  score: number;
  total: number;
  createdAt: string;
};

export type Correction = {
  text: string;
  choices: string[];
  correctIndex: number;
  answerIndex: number;
};

export type AttemptResult = {
  score: number;
  total: number;
  createdAt: string;
  correction: Correction[];
  leaderboard: LeaderboardEntry[];
};

export type AdminView = {
  ownerName: string;
  questions: { text: string; choices: string[]; correctIndex: number }[];
  attempts: (LeaderboardEntry & { answers: number[] })[];
};
