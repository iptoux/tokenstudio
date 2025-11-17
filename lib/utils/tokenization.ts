import type { SimpleToken, Token, TokenWithPosition } from "../types";

export function calculateCounts(value: string): { chars: number; bytes: number } {
  if (!value) {
    return { chars: 0, bytes: 0 };
  }

  const chars = value.length;
  const bytes = typeof window === "undefined" ? chars : new TextEncoder().encode(value).length;

  return { chars, bytes };
}

export function approximateTokensFromText(text: string): number {
  if (!text) return 0;
  const bytes = typeof window === "undefined" ? text.length : new TextEncoder().encode(text).length;

  // Very simple heuristic: tokens roughly equal bytes / 4 (approx for English/BPE tokens).
  // This is intentionally approximate — it gives a helpful comparison across formats
  // for the purpose of this tool without introducing a dependency on a tokenizer.
  return Math.max(1, Math.ceil(bytes / 4));
}

export function simpleTokenize(text: string): SimpleToken[] {
  if (!text) return [];

  // Fallback, approximate tokenizer: splits on whitespace and punctuation but preserves tokens and positions.
  const regex = /\s+|[A-Za-z0-9_\-"'@]+|[^\sA-Za-z0-9_\-"'@]+/g;
  const tokens: SimpleToken[] = [];

  const idMap = new Map<string, number>();
  let nextId = 1;

  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    const tokenText = m[0];
    if (/^\s+$/.test(tokenText)) {
      tokens.push({ id: null, text: tokenText, start: m.index, end: m.index + tokenText.length });
      continue;
    }

    if (!idMap.has(tokenText)) idMap.set(tokenText, nextId++);

    tokens.push({ id: idMap.get(tokenText) ?? null, text: tokenText, start: m.index, end: m.index + tokenText.length });
  }

  return tokens;
}

export function colorForTokenId(id?: number | null): string {
  if (!id) return "transparent";
  const hue = (id * 47) % 360;
  return `hsla(${hue} 90% 45% / 0.2)`;
}

export type TokenForDisplay = {
  id: number | null | undefined;
  text: string;
};

export function getTokenIds(tokens: TokenForDisplay[] | Token[] | SimpleToken[]): number[] {
  return tokens
    .map((t) => (typeof t.id === "number" ? t.id : null))
    .filter((id): id is number => id !== null);
}

