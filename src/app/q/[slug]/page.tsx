import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicQuiz } from "@/lib/quiz";
import PlayQuiz from "./PlayQuiz";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quiz = await getPublicQuiz((await params).slug);
  if (!quiz) return {};
  const title = `Est-ce que tu connais ${quiz.ownerName} ?`;
  return { title, openGraph: { title, description: `${quiz.questions.length} questions. Prouve-le !` } };
}

export default async function QuizPage({ params }: Props) {
  const quiz = await getPublicQuiz((await params).slug);
  if (!quiz) notFound();
  return <PlayQuiz quiz={quiz} />;
}
