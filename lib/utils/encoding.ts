import type { EncodingFormat } from "../types";

export function encodeWithFormat(input: string, format: EncodingFormat): string {
  switch (format) {
    case "hex": {
      return Array.from(input)
        .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
    }
    case "url-safe": {
      return encodeURIComponent(input);
    }
    case "base64":
    default: {
      if (typeof window === "undefined") {
        return Buffer.from(input, "utf-8").toString("base64");
      }

      return typeof btoa === "function" ? btoa(unescape(encodeURIComponent(input))) : input;
    }
  }
}

