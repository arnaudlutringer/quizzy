"use server";

import { createQuiz, InputError, submitAttempt } from "@/lib/quiz";
import type { AttemptResult, QuestionDraft } from "@/lib/types";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function wrap<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof InputError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Une erreur est survenue, réessaie dans un instant." };
  }
}

export async function createQuizAction(ownerName: string, questions: QuestionDraft[]) {
  return wrap(() => createQuiz(ownerName, questions));
}

export async function submitAttemptAction(
  slug: string,
  playerName: string,
  answers: number[],
): Promise<Result<AttemptResult>> {
  return wrap(() => submitAttempt(slug, playerName, answers));
}
