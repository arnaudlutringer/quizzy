import Link from "next/link";
import { notFound } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";
import { getLeaderboard } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await getLeaderboard(slug);
  if (!board) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Qui connaît le mieux {board.ownerName} ?</h1>
      <section className="card">
        <Leaderboard entries={board.entries} />
      </section>
      <Link href={`/q/${slug}`} className="btn w-full">
        Jouer
      </Link>
    </div>
  );
}
