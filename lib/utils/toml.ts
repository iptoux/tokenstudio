import { stringify } from "@iarna/toml";

/**
 * Convert parsed JSON to TOML format using @iarna/toml library.
 */
export function jsonToToml(parsed: unknown): string {
  try {
    // @iarna/toml expects a plain object, so we ensure it's a valid TOML structure
    if (parsed === null || typeof parsed !== "object") {
      return stringify({ value: parsed });
    }

    if (Array.isArray(parsed)) {
      // TOML doesn't support top-level arrays well, so we wrap it
      return stringify({ array: parsed });
    }

    // For objects, we can directly stringify
    return stringify(parsed as Record<string, unknown>);
  } catch (err) {
    // Fallback to an empty string on error so the UI shows a parse error instead
    return "";
  }
}

