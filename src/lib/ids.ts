import "server-only";
import { randomBytes } from "crypto";

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

export function randomId(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}
