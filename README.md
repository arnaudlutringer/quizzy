# Quizzy · Est-ce que tu me connais ?

Tu crées un quiz sur toi, tu envoies le lien à tes amis, ils devinent tes réponses et chacun voit son score et le classement.

Web app Next.js (App Router) + Supabase (Postgres). Pas de compte : le créateur reçoit un lien secret pour suivre les réponses.

## Pages

- `/` : accueil
- `/creer` : création du quiz (questions suggérées, toutes modifiables, 3 à 20 questions, 2 à 4 réponses)
- `/q/<slug>` : le quiz à partager ; le score est calculé côté serveur, les bonnes réponses ne sont jamais envoyées au navigateur avant la fin
- `/q/<slug>/classement` : classement public
- `/q/<slug>/admin?key=<clé>` : vue du créateur (liens de partage, classement, détail des réponses de chaque ami)

## Lancer en local

1. Crée un projet sur [supabase.com](https://supabase.com) et exécute `supabase/schema.sql` dans l'éditeur SQL.
2. Copie `.env.example` en `.env.local` et remplis `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (Settings > API).
3. `npm install` puis `npm run dev`, et ouvre http://localhost:3000.

## Déployer

Sur Vercel : importe le repo et ajoute les deux variables d'environnement ci-dessus.

L'ancienne app Ionic/Cordova (2019) reste disponible dans l'historique git.
