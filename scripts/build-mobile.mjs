// Construit le front pour l'app mobile puis le copie dans les projets Android et iOS.
// Usage : NEXT_PUBLIC_API_URL=https://mon-site.fr/api npm run build:mobile

import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

const api = process.env.NEXT_PUBLIC_API_URL;
if (!api || !/^https?:\/\//.test(api)) {
  console.error("Indique l'URL publique de l'API, par exemple NEXT_PUBLIC_API_URL=https://mon-site.fr/api");
  process.exit(1);
}
// Par défaut, les liens partagés pointent vers le site qui sert l'API.
const site = process.env.NEXT_PUBLIC_SITE_URL ?? api.replace(/\/api\/?$/, "");

const env = { ...process.env, NEXT_PUBLIC_API_URL: api, NEXT_PUBLIC_SITE_URL: site };
const run = (cmd) => execSync(cmd, { stdio: "inherit", env });

run("npx next build");
// L'API PHP (et un éventuel config.php avec ses identifiants) reste sur le serveur.
rmSync("out/api", { recursive: true, force: true });
run("npx cap sync");
