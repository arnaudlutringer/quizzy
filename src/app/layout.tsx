import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizzy · Est-ce que tu me connais ?",
  description: "Crée ton quiz, envoie le lien à tes amis et découvre qui te connaît le mieux.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <header className="mx-auto flex max-w-2xl items-center px-4 py-5">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-violet-600">
            Quizzy
          </Link>
        </header>
        <main className="mx-auto max-w-2xl px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
