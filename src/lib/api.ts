import { useEffect, useState } from "react";
import type { AdminView, AttemptResult, LeaderboardEntry, PublicQuiz, QuestionDraft } from "./types";

// Même origine par défaut ; en développement (`npm run dev`) et dans l'app mobile,
// pointer vers le serveur PHP.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Impossible de joindre le serveur.", 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error ?? "Une erreur est survenue, réessaie dans un instant.", res.status);
  return data as T;
}

const q = encodeURIComponent;

export const api = {
  createQuiz: (ownerName: string, questions: QuestionDraft[]) =>
    call<{ slug: string; adminKey: string }>("create.php", { ownerName, questions }),
  getQuiz: (slug: string) => call<PublicQuiz>(`quiz.php?id=${q(slug)}`),
  submitAttempt: (slug: string, playerName: string, answers: number[]) =>
    call<AttemptResult>(`attempt.php?id=${q(slug)}`, { playerName, answers }),
  getLeaderboard: (slug: string) =>
    call<{ ownerName: string; entries: LeaderboardEntry[] }>(`leaderboard.php?id=${q(slug)}`),
  getAdmin: (slug: string, key: string) => call<AdminView>(`admin.php?id=${q(slug)}&key=${q(key)}`),
};

export type Loaded<T> = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ok"; data: T };

// Charge une ressource au montage (et quand `deps` change). Le résultat est
// rattaché à ses `deps` : tant qu'il ne correspond pas aux `deps` courantes, on est en chargement.
export function useLoad<T>(load: () => Promise<T>, deps: string[]): Loaded<T> {
  const key = JSON.stringify(deps);
  const [state, setState] = useState<{ key: string; value: Loaded<T> } | null>(null);
  useEffect(() => {
    let alive = true;
    load().then(
      (data) => alive && setState({ key, value: { status: "ok", data } }),
      (error) => alive && setState({ key, value: { status: "error", error } }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state?.key === key ? state.value : { status: "loading" };
}
