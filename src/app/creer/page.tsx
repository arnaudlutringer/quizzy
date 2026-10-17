import type { Metadata } from "next";
import QuizBuilder from "./QuizBuilder";

export const metadata: Metadata = { title: "Créer mon quiz · Quizzy" };

export default function CreatePage() {
  return <QuizBuilder />;
}
