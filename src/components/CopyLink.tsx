"use client";

import { useState, useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

// Dans l'app mobile, l'origine est locale (`https://localhost`) : les liens partagés
// pointent alors vers le site public.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const subscribe = () => () => {};

// `path` est relatif au site ; l'URL complète est calculée côté navigateur.
export default function CopyLink({ path, label }: { path: string; label: string }) {
  const origin = useSyncExternalStore(
    subscribe,
    () => SITE_URL ?? window.location.origin,
    () => SITE_URL ?? "",
  );
  const url = origin + path;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({ title: "Est-ce que tu me connais ?", url });
        return;
      }
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: "Est-ce que tu me connais ?", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // partage annulé : rien à faire
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{label}</div>
      <div className="flex gap-2">
        <input className="input text-sm" readOnly value={url} onFocus={(e) => e.target.select()} />
        <button type="button" className="btn shrink-0 px-4 py-2" onClick={copy}>
          {copied ? "Copié !" : "Partager"}
        </button>
      </div>
    </div>
  );
}
