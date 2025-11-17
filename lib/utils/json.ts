import type { TokenWithPosition } from "../types";

export function isReservedYamlWord(word: string): boolean {
  const reserved = ['true', 'false', 'null', 'yes', 'no', 'on', 'off', 'true', '~'];
  return reserved.includes(word.toLowerCase());
}

export function jsonToYamlLite(value: unknown, indent = 0, tokenAware = false): string {
  const space = "  ".repeat(indent);

  if (value === null || typeof value !== "object") {
    if (typeof value === "string") {
      // Token-aware formatting: omit quotes for simple, safe strings
      if (tokenAware && /^[a-zA-Z0-9_-]+$/.test(value) && !isReservedYamlWord(value)) {
        return value;
      }
      return JSON.stringify(value);
    }
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    return value
      .map((item) => {
        const nested = jsonToYamlLite(item, indent + 1, tokenAware);
        if (typeof item === "object" && item !== null && nested.includes("\n")) {
          return `${space}- ${nested.split("\n")[0]}\n${nested
            .split("\n")
            .slice(1)
            .map((line) => `${"  "}${line}`)
            .join("\n")}`;
        }

        return `${space}- ${nested}`;
      })
      .join("\n");
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) {
    return "{}";
  }

  return entries
    .map(([key, val]) => {
      const nested = jsonToYamlLite(val, indent + 1, tokenAware);
      if (val !== null && typeof val === "object") {
        return `${space}${key}:\n${"  ".repeat(indent + 1)}${nested.replace(/\n/g, `\n${"  ".repeat(indent + 1)}`)}`;
      }

      return `${space}${key}: ${nested}`;
    })
    .join("\n");
}

export function jsonStringify(value: unknown, tokenAware = false, indent?: number | string): string {
  if (!tokenAware) {
    return JSON.stringify(value, null, indent);
  }

  return JSON.stringify(value, (key, val) => {
    // For strings, omit quotes if safe and token-aware is enabled
    if (typeof val === "string" && /^[a-zA-Z0-9_-]+$/.test(val) && !isReservedYamlWord(val)) {
      // Return a special marker that we'll handle in postprocessing
      return `__UNQUOTED__${val}__`;
    }
    return val;
  }, indent)
    .replace(/\"__UNQUOTED__(.+?)__\"/g, '$1'); // Remove quotes from marked strings
}

