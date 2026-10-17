"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Leaderboard from "@/components/Leaderboard";
import { LoadError, Loading } from "@/components/Status";
import { api, useLoad } from "@/lib/api";

function LeaderboardLoader() {
  const slug = useSearchParams().get("id") ?? "";
  const state = useLoad(() => api.getLeaderboard(slug), [slug]);
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <LoadError error={state.error} />;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Qui connaît le mieux {state.data.ownerName} ?</h1>
      <section className="card">
        <Leaderboard entries={state.data.entries} />
      </section>
      <Link href={`/q/?id=${slug}`} className="btn w-full">
        Jouer
      </Link>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LeaderboardLoader />
    </Suspense>
  );
}
