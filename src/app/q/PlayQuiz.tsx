"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import Leaderboard from "@/components/Leaderboard";
import { api } from "@/lib/api";
import { LIMITS, type AttemptResult, type PublicQuiz } from "@/lib/types";

function verdict(score: number, total: number, owner: string) {
  const ratio = total ? score / total : 0;
  if (ratio === 1) return `Sans faute ! Tu connais ${owner} par cœur.`;
  if (ratio >= 0.7) return `Bravo, tu connais vraiment bien ${owner}.`;
  if (ratio >= 0.4) return `Pas mal, mais ${owner} a encore des secrets pour toi.`;
  return `Aïe… Il est temps de passer plus de temps avec ${owner} !`;
}

export default function PlayQuiz({ quiz }: { quiz: PublicQuiz }) {
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const total = quiz.questions.length;

  const send = (finalAnswers: number[]) => {
    setError(null);
    startTransition(async () => {
      try {
        setResult(await api.submitAttempt(quiz.slug, playerName, finalAnswers));
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  const choose = (index: number) => {
    const next = [...answers.slice(0, step), index];
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else send(next);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <section className="card space-y-2 text-center">
          <div className="text-5xl font-extrabold text-violet-600">
            {result.score}/{result.total}
          </div>
          <p className="text-lg">{verdict(result.score, result.total, quiz.ownerName)}</p>
        </section>
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">Classement</h2>
          <Leaderboard entries={result.leaderboard} highlight={result.createdAt} />
        </section>
        <section className="card space-y-4">
          <h2 className="text-lg font-bold">Les bonnes réponses</h2>
          {result.correction.map((c, i) => {
            const ok = c.answerIndex === c.correctIndex;
            return (
              <div key={i} className="space-y-1">
                <div className="font-medium">
                  {ok ? "✅" : "❌"} {c.text}
                </div>
                <div className="pl-7 text-sm opacity-80">
                  Réponse de {quiz.ownerName} : <strong>{c.choices[c.correctIndex]}</strong>
                  {!ok && <> · toi : {c.choices[c.answerIndex]}</>}
                </div>
              </div>
            );
          })}
        </section>
        <Link href="/creer/" className="btn w-full">
          À mon tour de créer mon quiz
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-6 pt-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Est-ce que tu connais {quiz.ownerName} ?</h1>
        <p className="opacity-75">
          {total} questions. Devine ce que {quiz.ownerName} a répondu.
        </p>
        <form
          className="card mx-auto max-w-sm space-y-3 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            if (playerName.trim()) setStarted(true);
          }}
        >
          <label className="block space-y-2">
            <span className="font-semibold">Ton prénom</span>
            <input
              className="input"
              autoFocus
              value={playerName}
              maxLength={LIMITS.name}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>
          <button className="btn w-full" disabled={!playerName.trim()}>
            C&apos;est parti
          </button>
        </form>
      </div>
    );
  }

  const q = quiz.questions[step];
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm opacity-70">
          <span>
            Question {step + 1}/{total}
          </span>
          {step > 0 && !pending && (
            <button type="button" className="hover:underline" onClick={() => setStep(step - 1)}>
              ← Précédente
            </button>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950">
          <div className="h-full bg-violet-600 transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </div>
      <h1 className="text-2xl font-bold">{q.text}</h1>
      <div className="grid gap-3">
        {q.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            disabled={pending}
            onClick={() => choose(i)}
            className={`card text-left text-lg font-medium transition hover:border-violet-400 hover:bg-violet-50 disabled:opacity-60 dark:hover:bg-violet-950 ${
              answers[step] === i ? "border-violet-500" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {pending && <p className="text-center opacity-70">Calcul du score…</p>}
      {error && (
        <div className="space-y-2 rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
          <p>{error}</p>
          <button type="button" className="underline" onClick={() => send(answers)}>
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
