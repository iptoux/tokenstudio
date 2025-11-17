import { encode as encodeToon } from "@toon-format/toon";
import type { ToonDelimiter, ToonKeyFolding } from "../types";

/**
 * Encode parsed JSON as TOON using the official library.
 */
export function toToonEncoding(
  parsed: unknown,
  delimiter: ToonDelimiter = ",",
  keyFolding: ToonKeyFolding = "off"
): string {
  try {
    const encoded = encodeToon(parsed, { delimiter, keyFolding });
    return encoded || "";
  } catch (err) {
    // Fallback to an empty string on error so the UI shows a parse error instead
    return "";
  }
}

