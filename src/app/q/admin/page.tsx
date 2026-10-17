"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CopyLink from "@/components/CopyLink";
import Leaderboard from "@/components/Leaderboard";
import { LoadError, Loading } from "@/components/Status";
import { api, useLoad } from "@/lib/api";

function AdminLoader() {
  const params = useSearchParams();
  const slug = params.get("id") ?? "";
  const key = params.get("key") ?? "";
  const isNew = params.has("nouveau");
  const state = useLoad(() => api.getAdmin(slug, key), [slug, key]);

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <LoadError error={state.error} />;
  const view = state.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {isNew ? "Ton quiz est prêt 🎉" : `Le quiz de ${view.ownerName}`}
      </h1>

      <section className="card space-y-5">
        <CopyLink path={`/q/?id=${slug}`} label="Lien à envoyer à tes amis" />
        <CopyLink path={`/q/admin/?id=${slug}&key=${key}`} label="Ton lien secret pour revenir ici (garde-le pour toi)" />
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-bold">Classement</h2>
        <Leaderboard entries={view.attempts} />
      </section>

      {view.attempts.length > 0 && (
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">Les réponses de tes amis</h2>
          {view.attempts.map((a) => (
            <details
              key={`${a.playerName}-${a.createdAt}`}
              className="rounded-xl border border-violet-100 p-3 dark:border-violet-900/50"
            >
              <summary className="cursor-pointer font-medium">
                {a.playerName} · {a.score}/{a.total}
              </summary>
              <ul className="mt-2 space-y-1 text-sm">
                {view.questions.map((q, i) => (
                  <li key={i}>
                    {a.answers[i] === q.correctIndex ? "✅" : "❌"} {q.text} : <strong>{q.choices[a.answers[i]]}</strong>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminLoader />
    </Suspense>
  );
}
