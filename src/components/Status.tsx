import Link from "next/link";
import type { ApiError } from "@/lib/api";

export function Loading() {
  return <p className="pt-10 text-center opacity-70">Chargement…</p>;
}

export function LoadError({ error }: { error: ApiError }) {
  if (error.status === 404) {
    return (
      <div className="space-y-4 pt-10 text-center">
        <h1 className="text-3xl font-extrabold">Quiz introuvable</h1>
        <p className="opacity-75">Le lien est peut-être incomplet.</p>
        <Link href="/creer/" className="btn">
          Créer mon quiz
        </Link>
      </div>
    );
  }
  return <p className="pt-10 text-center text-red-600">{error.message}</p>;
}
