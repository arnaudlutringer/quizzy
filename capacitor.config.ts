import type { CapacitorConfig } from "@capacitor/cli";

// L'app embarque l'export statique de Next.js (`out/`, construit par `npm run build:mobile`)
// et appelle l'API PHP du site public.
const config: CapacitorConfig = {
  appId: "com.arnaudlutringer.quizzy",
  appName: "Quizzy",
  webDir: "out",
};

export default config;
