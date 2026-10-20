# Quizzy · Est-ce que tu me connais ?

Tu crées un quiz sur toi, tu envoies le lien à tes amis, ils devinent tes réponses et chacun voit son score et le classement.

- **Front** : Next.js exporté en fichiers statiques (`out/`).
- **Backend** : une petite API PHP 8 (`public/api/`, copiée dans `out/api/` au build) avec PDO, en **SQLite** par défaut ou **MySQL/MariaDB**.

Pas de compte : le créateur reçoit un lien secret pour suivre les réponses. Les tables sont créées automatiquement au premier appel.

## Installer sur ton serveur PHP local

Prérequis : PHP 8.1+ avec `pdo_sqlite` (ou `pdo_mysql`), et Node 22+ pour construire le front.

```bash
npm install
npm run build          # génère out/ (front + API)
php -S localhost:8000 -t out
```

Puis ouvre http://localhost:8000.

Avec Apache, Nginx, MAMP, Valet ou Herd, fais pointer la racine du site sur le dossier `out/` (par exemple `quizzy.test` → `…/quizzy/out`). L'app doit être servie à la racine d'un domaine.

### Base de données

Par défaut, les données vont dans `data/quizzy.sqlite` (en dehors du dossier servi). Pour MySQL, crée une base vide puis copie `public/api/config.sample.php` en `public/api/config.php` et remplis le DSN, l'utilisateur et le mot de passe. Relance `npm run build` pour que `out/api/config.php` soit à jour (ou modifie directement `out/api/config.php`).

## Développer

```bash
php -S localhost:8000 -t public                              # l'API
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run dev    # le front, sur http://localhost:3000
```

## App mobile (Capacitor)

Les projets natifs sont dans `android/` et `ios/`. L'app embarque le front et appelle l'API PHP de ton site public, qui doit donc être en ligne en HTTPS.

```bash
NEXT_PUBLIC_API_URL=https://mon-site.fr/api npm run build:mobile   # build + copie dans android/ et ios/
npm run android   # ouvre Android Studio
npm run ios       # ouvre Xcode (sur Mac)
```

Les liens partagés depuis l'app pointent vers `https://mon-site.fr` (l'URL de l'API sans `/api`) ; pour en choisir un autre, ajoute `NEXT_PUBLIC_SITE_URL`. L'API accepte par défaut les origines de l'app (`https://localhost` sur Android, `capacitor://localhost` sur iOS) ; si ton `config.php` redéfinit `cors_origins`, garde-les dans la liste.

Prérequis : Node 22+, Android Studio (JDK 21) pour Android, Xcode 26 pour iOS.

## API

| Endpoint | Méthode | Rôle |
| --- | --- | --- |
| `api/create.php` | POST | Crée un quiz, renvoie `slug` et `adminKey` |
| `api/quiz.php?id=` | GET | Le quiz pour un joueur, sans les bonnes réponses |
| `api/attempt.php?id=` | POST | Enregistre les réponses d'un ami, renvoie score, correction et classement |
| `api/leaderboard.php?id=` | GET | Classement public |
| `api/admin.php?id=&key=` | GET | Vue du créateur avec les réponses de chaque ami |

## Pages

- `/` : accueil
- `/creer/` : création du quiz
- `/q/?id=<slug>` : le quiz à partager
- `/q/classement/?id=<slug>` : classement
- `/q/admin/?id=<slug>&key=<clé>` : vue du créateur

L'ancienne app Ionic/Cordova (2019) reste disponible dans l'historique git.
