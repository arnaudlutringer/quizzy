import Link from "next/link";

export default function NotFound() {
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
