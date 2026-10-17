import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import Leaderboard from "@/components/Leaderboard";
import { getAdminView } from "@/lib/quiz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mon quiz · Quizzy", robots: { index: false } };

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string; nouveau?: string }>;
};

export default async function AdminPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { key = "", nouveau } = await searchParams;
  const view = await getAdminView(slug, key);
  if (!view) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {nouveau ? "Ton quiz est prêt 🎉" : `Le quiz de ${view.ownerName}`}
      </h1>

      <section className="card space-y-5">
        <CopyLink path={`/q/${slug}`} label="Lien à envoyer à tes amis" />
        <CopyLink path={`/q/${slug}/admin?key=${key}`} label="Ton lien secret pour revenir ici (garde-le pour toi)" />
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-bold">Classement</h2>
        <Leaderboard entries={view.attempts} />
      </section>

      {view.attempts.length > 0 && (
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">Les réponses de tes amis</h2>
          {view.attempts.map((a) => (
            <details key={`${a.playerName}-${a.createdAt}`} className="rounded-xl border border-violet-100 p-3 dark:border-violet-900/50">
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
