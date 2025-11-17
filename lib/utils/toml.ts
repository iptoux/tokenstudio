import { stringify } from "@iarna/toml";

function isReservedTomlWord(word: string): boolean {
  const reserved = ['true', 'false', 'null', 'inf', 'nan', '-inf', '-nan', '+inf', '+nan'];
  return reserved.includes(word.toLowerCase());
}

function isSafeTomlString(value: string): boolean {
  // TOML bare keys/strings must match: [A-Za-z0-9_-]+
  // And not be reserved words
  return /^[A-Za-z0-9_-]+$/.test(value) && !isReservedTomlWord(value);
}

/**
 * Convert parsed JSON to TOML format using @iarna/toml library.
 * @param parsed - The parsed JSON object
 * @param tokenAware - If true, removes quotes from simple strings that are safe for TOML
 */
export function jsonToToml(parsed: unknown, tokenAware = false): string {
  try {
    let tomlOutput: string;
    
    // @iarna/toml expects a plain object, so we ensure it's a valid TOML structure
    if (parsed === null || typeof parsed !== "object") {
      tomlOutput = stringify({ value: parsed } as any);
    } else if (Array.isArray(parsed)) {
      // TOML doesn't support top-level arrays well, so we wrap it
      tomlOutput = stringify({ array: parsed } as any);
    } else {
      // For objects, we can directly stringify
      tomlOutput = stringify(parsed as any);
    }

    // Post-process to remove quotes from simple strings if token-aware is enabled
    if (tokenAware) {
      // Match quoted strings that are safe to unquote
      // Pattern: "simple_string" (but not "string with spaces" or "string\nwith\nnewlines")
      tomlOutput = tomlOutput.replace(/"([A-Za-z0-9_-]+)"/g, (match, content) => {
        // Only unquote if it's a safe TOML string and not a reserved word
        if (isSafeTomlString(content)) {
          return content;
        }
        return match;
      });
    }

    return tomlOutput;
  } catch (err) {
    // Fallback to an empty string on error so the UI shows a parse error instead
    return "";
  }
}

