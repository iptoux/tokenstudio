import { useEffect, useState } from "react";
import type { OutputFormat, Token, TokenizationModel, ExactTokens } from "@/lib/types";

type UseTokenizationProps = {
  texts: Record<OutputFormat, string>;
  tokenizationModel: TokenizationModel;
  showTokens: boolean;
  showCounts: boolean;
};

export function useTokenization({ texts, tokenizationModel, showTokens, showCounts }: UseTokenizationProps) {
  const [exactTokens, setExactTokens] = useState<ExactTokens>({} as ExactTokens);
  const [isTokenizing, setIsTokenizing] = useState<boolean>(false);
  const [tokenizeError, setTokenizeError] = useState<string>("");

  useEffect(() => {
    if (tokenizationModel !== "cl100k_base") {
      setExactTokens({} as ExactTokens);
      setIsTokenizing(false);
      setTokenizeError("");
      return;
    }

    // Only compute exact tokenization when needed.
    if (!showTokens && !showCounts) {
      setExactTokens({} as ExactTokens);
      setIsTokenizing(false);
      setTokenizeError("");
      return;
    }

    if (!texts.pretty && !texts.minified && !texts.yaml && !texts.toon) {
      setExactTokens({} as ExactTokens);
      setIsTokenizing(false);
      setTokenizeError("");
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      try {
        setIsTokenizing(true);
        setTokenizeError("");

        const res = await fetch("/api/tokenize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: tokenizationModel, texts }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => ({}))) as { error?: string };
          if (!cancelled) {
            setExactTokens({} as ExactTokens);
            setTokenizeError(payload.error || "Failed to tokenize");
          }
          return;
        }

        const payload = (await res.json()) as { tokens?: Record<OutputFormat, Token[]> };
        if (!cancelled) {
          setExactTokens((payload.tokens ?? {}) as ExactTokens);
        }
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return;
        setExactTokens({} as ExactTokens);
        setTokenizeError(err instanceof Error ? err.message : "Failed to tokenize");
      } finally {
        if (!cancelled) {
          setIsTokenizing(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [texts, tokenizationModel, showTokens, showCounts]);

  return { exactTokens, isTokenizing, tokenizeError };
}

