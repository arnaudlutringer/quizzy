import type { QuestionDraft } from "./types";

// Questions proposées au créateur ; il peut toutes les modifier.
// La bonne réponse est à choisir par le créateur, d'où correctIndex = -1.
const s = (text: string, choices: string[]): QuestionDraft => ({ text, choices, correctIndex: -1 });

export const SUGGESTIONS: QuestionDraft[] = [
  s("Chat ou chien ?", ["Chat", "Chien", "Les deux", "Aucun"]),
  s("Mon plat préféré ?", ["Pizza", "Sushi", "Raclette", "Burger"]),
  s("Ma saison préférée ?", ["Printemps", "Été", "Automne", "Hiver"]),
  s("Plutôt mer ou montagne ?", ["Mer", "Montagne"]),
  s("Plutôt lève-tôt ou couche-tard ?", ["Lève-tôt", "Couche-tard"]),
  s("Ma boisson du matin ?", ["Café", "Thé", "Jus", "Rien"]),
  s("Le pays où je rêve d'aller ?", ["Japon", "Islande", "Canada", "Australie"]),
  s("Mon style de film préféré ?", ["Comédie", "Action", "Horreur", "Science-fiction"]),
  s("Ce que je fais un dimanche idéal ?", ["Grasse matinée", "Sport", "Sortie entre amis", "Série en boucle"]),
  s("Ma plus grande peur ?", ["Les araignées", "Le vide", "Le noir", "Parler en public"]),
  s("Sucré ou salé ?", ["Sucré", "Salé"]),
  s("Mon super-pouvoir rêvé ?", ["Voler", "Être invisible", "Lire dans les pensées", "Me téléporter"]),
];
