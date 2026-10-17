import "server-only";
import { db } from "./supabase";
import { randomId } from "./ids";
import {
  LIMITS,
  type AttemptResult,
  type LeaderboardEntry,
  type PublicQuiz,
  type QuestionDraft,
} from "./types";

type QuizRow = { id: string; slug: string; admin_key: string; owner_name: string };
type QuestionRow = { id: string; position: number; text: string; choices: string[]; correct_index: number };
type AttemptRow = {
  player_name: string;
  answers: number[];
  score: number;
  total: number;
  created_at: string;
};

export class InputError extends Error {}

function cleanName(raw: unknown): string {
  const name = String(raw ?? "").trim().slice(0, LIMITS.name);
  if (!name) throw new InputError("Indique un prénom.");
  return name;
}

export function validateQuestions(raw: unknown): QuestionDraft[] {
  if (!Array.isArray(raw)) throw new InputError("Questions invalides.");
  const questions = raw.map((q, i): QuestionDraft => {
    const text = String(q?.text ?? "").trim().slice(0, LIMITS.question);
    const choices: string[] = Array.isArray(q?.choices)
      ? q.choices.map((c: unknown) => String(c ?? "").trim().slice(0, LIMITS.choice))
      : [];
    const correctIndex = Number(q?.correctIndex);
    const n = i + 1;
    if (!text) throw new InputError(`La question ${n} est vide.`);
    if (choices.length < LIMITS.minChoices || choices.length > LIMITS.maxChoices || choices.some((c) => !c)) {
      throw new InputError(`La question ${n} doit avoir entre ${LIMITS.minChoices} et ${LIMITS.maxChoices} réponses remplies.`);
    }
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= choices.length) {
      throw new InputError(`Choisis la bonne réponse de la question ${n}.`);
    }
    return { text, choices, correctIndex };
  });
  if (questions.length < LIMITS.minQuestions || questions.length > LIMITS.maxQuestions) {
    throw new InputError(`Il faut entre ${LIMITS.minQuestions} et ${LIMITS.maxQuestions} questions.`);
  }
  return questions;
}

export async function createQuiz(ownerName: unknown, rawQuestions: unknown) {
  const name = cleanName(ownerName);
  const questions = validateQuestions(rawQuestions);
  const slug = randomId(8);
  const adminKey = randomId(24);

  const { data: quiz, error } = await db()
    .from("quizzes")
    .insert({ slug, admin_key: adminKey, owner_name: name })
    .select("id")
    .single();
  if (error) throw error;

  const { error: qError } = await db()
    .from("questions")
    .insert(
      questions.map((q, position) => ({
        quiz_id: quiz.id,
        position,
        text: q.text,
        choices: q.choices,
        correct_index: q.correctIndex,
      })),
    );
  if (qError) {
    await db().from("quizzes").delete().eq("id", quiz.id);
    throw qError;
  }
  return { slug, adminKey };
}

async function loadQuiz(slug: string): Promise<{ quiz: QuizRow; questions: QuestionRow[] } | null> {
  const { data: quiz, error } = await db()
    .from("quizzes")
    .select("id, slug, admin_key, owner_name")
    .eq("slug", slug)
    .maybeSingle<QuizRow>();
  if (error) throw error;
  if (!quiz) return null;
  const { data: questions, error: qError } = await db()
    .from("questions")
    .select("id, position, text, choices, correct_index")
    .eq("quiz_id", quiz.id)
    .order("position");
  if (qError) throw qError;
  return { quiz, questions: (questions ?? []) as QuestionRow[] };
}

export async function getPublicQuiz(slug: string): Promise<PublicQuiz | null> {
  const loaded = await loadQuiz(slug);
  if (!loaded) return null;
  return {
    slug: loaded.quiz.slug,
    ownerName: loaded.quiz.owner_name,
    questions: loaded.questions.map((q) => ({ id: q.id, text: q.text, choices: q.choices })),
  };
}

async function getAttempts(quizId: string): Promise<AttemptRow[]> {
  const { data, error } = await db()
    .from("attempts")
    .select("player_name, answers, score, total, created_at")
    .eq("quiz_id", quizId)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as AttemptRow[];
}

const toEntry = (a: AttemptRow): LeaderboardEntry => ({
  playerName: a.player_name,
  score: a.score,
  total: a.total,
  createdAt: a.created_at,
});

export async function getLeaderboard(slug: string) {
  const loaded = await loadQuiz(slug);
  if (!loaded) return null;
  const attempts = await getAttempts(loaded.quiz.id);
  return { ownerName: loaded.quiz.owner_name, entries: attempts.map(toEntry) };
}

export async function submitAttempt(slug: string, playerName: unknown, rawAnswers: unknown): Promise<AttemptResult> {
  const name = cleanName(playerName);
  const loaded = await loadQuiz(slug);
  if (!loaded) throw new InputError("Ce quiz n'existe pas.");
  const { quiz, questions } = loaded;

  if (!Array.isArray(rawAnswers) || rawAnswers.length !== questions.length) {
    throw new InputError("Réponds à toutes les questions.");
  }
  const answers = rawAnswers.map((a, i) => {
    const n = Number(a);
    if (!Number.isInteger(n) || n < 0 || n >= questions[i].choices.length) {
      throw new InputError("Réponse invalide.");
    }
    return n;
  });
  const score = answers.filter((a, i) => a === questions[i].correct_index).length;

  const { error } = await db()
    .from("attempts")
    .insert({ quiz_id: quiz.id, player_name: name, answers, score, total: questions.length });
  if (error) throw error;

  const attempts = await getAttempts(quiz.id);
  return {
    score,
    total: questions.length,
    correction: questions.map((q, i) => ({
      text: q.text,
      choices: q.choices,
      correctIndex: q.correct_index,
      answerIndex: answers[i],
    })),
    leaderboard: attempts.map(toEntry),
  };
}

// Vue du créateur : protégée par la clé secrète de son lien d'administration.
export async function getAdminView(slug: string, key: string) {
  const loaded = await loadQuiz(slug);
  if (!loaded || !key || loaded.quiz.admin_key !== key) return null;
  const attempts = await getAttempts(loaded.quiz.id);
  return {
    ownerName: loaded.quiz.owner_name,
    questions: loaded.questions.map((q) => ({ text: q.text, choices: q.choices, correctIndex: q.correct_index })),
    attempts: attempts.map((a) => ({ ...toEntry(a), answers: a.answers })),
  };
}
