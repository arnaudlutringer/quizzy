import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10 pt-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Est-ce que tu me connais ?</h1>
        <p className="text-lg opacity-80">
          Réponds à quelques questions sur toi, envoie le lien à tes amis et découvre qui te connaît le mieux.
        </p>
        <Link href="/creer" className="btn text-lg">
          Créer mon quiz
        </Link>
      </section>
      <ol className="grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Crée ton quiz", "Choisis des questions sur toi et indique tes vraies réponses."],
          ["2", "Partage le lien", "Envoie-le à tes amis par message ou sur les réseaux."],
          ["3", "Compare les scores", "Chacun voit son score et le classement de tes amis."],
        ].map(([n, title, text]) => (
          <li key={n} className="card space-y-1">
            <div className="text-2xl font-bold text-violet-600">{n}</div>
            <div className="font-semibold">{title}</div>
            <p className="text-sm opacity-75">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
