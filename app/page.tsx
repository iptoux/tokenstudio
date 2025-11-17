'use client';

import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type EncodingFormat = "base64" | "hex" | "url-safe";

type Counts = {
  chars: number;
  bytes: number;
};

function calculateCounts(value: string): Counts {
  if (!value) {
    return { chars: 0, bytes: 0 };
  }

  const chars = value.length;
  const bytes = typeof window === "undefined" ? chars : new TextEncoder().encode(value).length;

  return { chars, bytes };
}

function jsonToYamlLite(value: unknown, indent = 0): string {
  const space = "  ".repeat(indent);

  if (value === null || typeof value !== "object") {
    if (typeof value === "string") {
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
        const nested = jsonToYamlLite(item, indent + 1);
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
      const nested = jsonToYamlLite(val, indent + 1);
      if (val !== null && typeof val === "object") {
        return `${space}${key}:\n${"  ".repeat(indent + 1)}${nested.replace(/\n/g, `\n${"  ".repeat(indent + 1)}`)}`;
      }

      return `${space}${key}: ${nested}`;
    })
    .join("\n");
}

function encodeWithFormat(input: string, format: EncodingFormat): string {
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

function toToonEncoding(minifiedJson: string, format: EncodingFormat, strength: number): string {
  const encoded = encodeWithFormat(minifiedJson, format);

  if (!encoded) return "";

  const clampedStrength = Math.min(Math.max(strength, 1), 5);
  const chunkSize = clampedStrength * 4;

  const chunks: string[] = [];
  for (let i = 0; i < encoded.length; i += chunkSize) {
    chunks.push(encoded.slice(i, i + chunkSize));
  }

  return chunks.join(" ");
}

export default function Home() {
  const [input, setInput] = useState<string>('{"hello": "world"}');
  const [encodingFormat, setEncodingFormat] = useState<EncodingFormat>("base64");
  const [encodingStrength, setEncodingStrength] = useState<number>(2);
  const [showCounts, setShowCounts] = useState<boolean>(true);

  const { error, prettyJson, minifiedJson, yaml, toon } = useMemo(() => {
    if (!input.trim()) {
      return {
        error: "",
        prettyJson: "",
        minifiedJson: "",
        yaml: "",
        toon: "",
      };
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      const minified = JSON.stringify(parsed);
      const yamlText = jsonToYamlLite(parsed);

      return {
        error: "",
        prettyJson: pretty,
        minifiedJson: minified,
        yaml: yamlText,
        toon: toToonEncoding(minified, encodingFormat, encodingStrength),
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Invalid JSON",
        prettyJson: "",
        minifiedJson: "",
        yaml: "",
        toon: "",
      };
    }
  }, [input, encodingFormat, encodingStrength]);

  const prettyCounts = calculateCounts(prettyJson);
  const minifiedCounts = calculateCounts(minifiedJson);
  const yamlCounts = calculateCounts(yaml);
  const toonCounts = calculateCounts(toon);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-8 lg:py-16">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">No auth</Badge>
              <span className="text-xs text-muted-foreground">JSON → YAML → Toon</span>
            </div>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              TokenTools
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Paste JSON once and view it as pretty JSON, minified JSON, YAML, and a token-aware toon encoding.
            </p>
          </div>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle>Input JSON</CardTitle>
              <CardDescription>Paste or type any valid JSON payload.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="space-y-2">
                <Label htmlFor="json-input">JSON</Label>
                <Textarea
                  id="json-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  spellCheck={false}
                  className="min-h-[220px] font-mono text-xs md:text-sm"
                  placeholder='e.g. {"user":"alice","roles":["admin","editor"]}'
                />
              </div>
              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  Parse error: {error}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="h-fit border-border/60">
            <CardHeader>
              <CardTitle>Encoding options</CardTitle>
              <CardDescription>
                Configure toon encoding and optional character / byte statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="encoding-format">Encoding format</Label>
                <Select
                  value={encodingFormat}
                  onValueChange={(value) => setEncodingFormat(value as EncodingFormat)}
                >
                  <SelectTrigger id="encoding-format">
                    <SelectValue placeholder="Select encoding format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base64">Base64 (compact, default)</SelectItem>
                    <SelectItem value="hex">Hex</SelectItem>
                    <SelectItem value="url-safe">URL-safe</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  A toon is derived from the minified JSON using the selected encoding.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="encoding-strength">Encoding strength</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {encodingStrength}
                  </span>
                </div>
                <Slider
                  id="encoding-strength"
                  min={1}
                  max={5}
                  step={1}
                  value={[encodingStrength]}
                  onValueChange={(value) => setEncodingStrength(value[0] ?? 2)}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values group encoded bytes into longer token-like chunks.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border border-border/60 bg-muted/40 px-3 py-3">
                <div className="space-y-0.5">
                  <Label htmlFor="show-counts">Show character &amp; byte count</Label>
                  <p className="text-xs text-muted-foreground">
                    Counts are computed per output using UTF-8 bytes.
                  </p>
                </div>
                <Switch
                  id="show-counts"
                  checked={showCounts}
                  onCheckedChange={setShowCounts}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Outputs</CardTitle>
              <CardDescription>
                View your data across the four formats. All outputs are derived live from the input JSON.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-1">
              <Tabs defaultValue="pretty" className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="pretty">Original JSON</TabsTrigger>
                  <TabsTrigger value="minified">Minified JSON</TabsTrigger>
                  <TabsTrigger value="yaml">YAML</TabsTrigger>
                  <TabsTrigger value="toon">Toon</TabsTrigger>
                </TabsList>

                <TabsContent value="pretty" className="space-y-2">
                  {showCounts && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Characters: {prettyCounts.chars}</span>
                      <span>Bytes: {prettyCounts.bytes}</span>
                    </div>
                  )}
                  <pre className="max-h-[360px] overflow-auto rounded-md bg-muted px-3 py-2 text-xs leading-relaxed md:text-sm">
                    <code>{prettyJson || "Pretty-printed JSON will appear here."}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="minified" className="space-y-2">
                  {showCounts && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Characters: {minifiedCounts.chars}</span>
                      <span>Bytes: {minifiedCounts.bytes}</span>
                    </div>
                  )}
                  <pre className="max-h-[360px] overflow-auto rounded-md bg-muted px-3 py-2 text-xs leading-relaxed md:text-sm">
                    <code>{minifiedJson || "Minified JSON will appear here."}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="yaml" className="space-y-2">
                  {showCounts && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Characters: {yamlCounts.chars}</span>
                      <span>Bytes: {yamlCounts.bytes}</span>
                    </div>
                  )}
                  <pre className="max-h-[360px] overflow-auto rounded-md bg-muted px-3 py-2 text-xs leading-relaxed md:text-sm">
                    <code>{yaml || "YAML conversion will appear here."}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="toon" className="space-y-2">
                  {showCounts && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Characters: {toonCounts.chars}</span>
                      <span>Bytes: {toonCounts.bytes}</span>
                    </div>
                  )}
                  <pre className="max-h-[360px] overflow-auto rounded-md bg-muted px-3 py-2 text-xs leading-relaxed md:text-sm">
                    <code>{toon || "Toon-encoded output will appear here."}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
