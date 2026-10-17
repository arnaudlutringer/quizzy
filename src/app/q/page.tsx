"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { LoadError, Loading } from "@/components/Status";
import { api, useLoad } from "@/lib/api";
import PlayQuiz from "./PlayQuiz";

function QuizLoader() {
  const slug = useSearchParams().get("id") ?? "";
  const state = useLoad(() => api.getQuiz(slug), [slug]);
  const ownerName = state.status === "ok" ? state.data.ownerName : null;

  useEffect(() => {
    if (ownerName) document.title = `Est-ce que tu connais ${ownerName} ? · Quizzy`;
  }, [ownerName]);

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <LoadError error={state.error} />;
  return <PlayQuiz quiz={state.data} />;
}

export default function QuizPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuizLoader />
    </Suspense>
  );
}
