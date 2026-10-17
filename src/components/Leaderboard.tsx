import type { LeaderboardEntry } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ entries, highlight }: { entries: LeaderboardEntry[]; highlight?: string }) {
  if (entries.length === 0) {
    return <p className="opacity-70">Personne n&apos;a encore joué. Partage le lien !</p>;
  }
  return (
    <ol className="divide-y divide-violet-100 dark:divide-violet-900/50">
      {entries.map((e, i) => (
        <li
          key={`${e.playerName}-${e.createdAt}`}
          className={`flex items-center gap-3 py-2 ${e.createdAt === highlight ? "font-bold text-violet-600" : ""}`}
        >
          <span className="w-8 text-center">{MEDALS[i] ?? i + 1}</span>
          <span className="flex-1 truncate">{e.playerName}</span>
          <span className="tabular-nums">
            {e.score}/{e.total}
          </span>
        </li>
      ))}
    </ol>
  );
}
