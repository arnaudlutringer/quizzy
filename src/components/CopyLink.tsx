"use client";

import { useEffect, useState } from "react";

// `path` est relatif au site ; l'URL complète est calculée côté navigateur.
export default function CopyLink({ path, label }: { path: string; label: string }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);

  useEffect(() => setUrl(window.location.origin + path), [path]);

  const copy = async () => {
    try {
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
