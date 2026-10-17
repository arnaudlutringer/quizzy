"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createQuizAction } from "../actions";
import { SUGGESTIONS } from "@/lib/suggestions";
import { LIMITS, type QuestionDraft } from "@/lib/types";

const clone = (q: QuestionDraft): QuestionDraft => ({ ...q, choices: [...q.choices] });

export default function QuizBuilder() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>(() => SUGGESTIONS.slice(0, 5).map(clone));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const unused = SUGGESTIONS.filter((s) => !questions.some((q) => q.text === s.text));

  const update = (i: number, fn: (q: QuestionDraft) => QuestionDraft) =>
    setQuestions((qs) => qs.map((q, j) => (j === i ? fn(clone(q)) : q)));

  const addQuestion = () => {
    const next = unused[0] ? clone(unused[0]) : { text: "", choices: ["", ""], correctIndex: -1 };
    setQuestions((qs) => [...qs, next]);
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await createQuizAction(ownerName, questions);
      if (!res.ok) return setError(res.error);
      router.push(`/q/${res.data.slug}/admin?key=${res.data.adminKey}&nouveau=1`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Crée ton quiz</h1>
        <p className="opacity-75">
          Modifie les questions comme tu veux et coche ta vraie réponse pour chacune. Tes amis devront deviner.
        </p>
      </div>

      <label className="card block space-y-2">
        <span className="font-semibold">Ton prénom</span>
        <input
          className="input"
          value={ownerName}
          maxLength={LIMITS.name}
          placeholder="Arno"
          onChange={(e) => setOwnerName(e.target.value)}
        />
      </label>

      {questions.map((q, i) => (
        <fieldset key={i} className="card space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-violet-600">Q{i + 1}</span>
            <input
              className="input font-medium"
              value={q.text}
              maxLength={LIMITS.question}
              placeholder="Ta question"
              onChange={(e) => update(i, (q) => ({ ...q, text: e.target.value }))}
            />
            <button
              type="button"
              className="px-2 text-xl opacity-50 hover:opacity-100"
              aria-label={`Supprimer la question ${i + 1}`}
              onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {q.choices.map((c, ci) => (
              <div key={ci} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${i}`}
                  className="size-5 accent-violet-600"
                  checked={q.correctIndex === ci}
                  aria-label={`Ma réponse : ${c || `choix ${ci + 1}`}`}
                  onChange={() => update(i, (q) => ({ ...q, correctIndex: ci }))}
                />
                <input
                  className="input"
                  value={c}
                  maxLength={LIMITS.choice}
                  placeholder={`Réponse ${ci + 1}`}
                  onChange={(e) =>
                    update(i, (q) => {
                      q.choices[ci] = e.target.value;
                      return q;
                    })
                  }
                />
                {q.choices.length > LIMITS.minChoices && (
                  <button
                    type="button"
                    className="px-2 opacity-50 hover:opacity-100"
                    aria-label="Retirer cette réponse"
                    onClick={() =>
                      update(i, (q) => {
                        q.choices.splice(ci, 1);
                        if (q.correctIndex === ci) q.correctIndex = -1;
                        else if (q.correctIndex > ci) q.correctIndex--;
                        return q;
                      })
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            {q.choices.length < LIMITS.maxChoices ? (
              <button
                type="button"
                className="text-violet-600 hover:underline"
                onClick={() => update(i, (q) => ({ ...q, choices: [...q.choices, ""] }))}
              >
                + Ajouter une réponse
              </button>
            ) : (
              <span />
            )}
            {q.correctIndex < 0 && <span className="text-amber-600">Coche ta réponse</span>}
          </div>
        </fieldset>
      ))}

      {questions.length < LIMITS.maxQuestions && (
        <button type="button" className="btn-ghost w-full" onClick={addQuestion}>
          + Ajouter une question
        </button>
      )}

      {error && <p className="rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      <button type="button" className="btn w-full text-lg" disabled={pending} onClick={submit}>
        {pending ? "Création…" : "Créer mon quiz"}
      </button>
    </div>
  );
}
