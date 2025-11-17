import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutputTabContent } from "./output-tab-content";
import type { OutputFormat, TokenViewMode, TokenCounts, TokenViewPerTab } from "@/lib/types";
import type { TokenForDisplay } from "@/lib/utils/tokenization";

type OutputTabsProps = {
  outputs: Record<OutputFormat, string>;
  counts: Record<OutputFormat, TokenCounts>;
  showCounts: boolean;
  showTokens: boolean;
  showCopyReady: boolean;
  tokenViewPerTab: TokenViewPerTab;
  onTokenViewPerTabChange: (format: OutputFormat, mode: TokenViewMode) => void;
  tokens: Record<OutputFormat, TokenForDisplay[] | undefined>;
  onCopyOutput: (format: OutputFormat) => void;
  onCopyTokenIds: (format: OutputFormat) => void;
};

export function OutputTabs({
  outputs,
  counts,
  showCounts,
  showTokens,
  showCopyReady,
  tokenViewPerTab,
  onTokenViewPerTabChange,
  tokens,
  onCopyOutput,
  onCopyTokenIds,
}: OutputTabsProps) {
  const formats: OutputFormat[] = ["pretty", "minified", "yaml", "toon", "toml"];
  const placeholders: Record<OutputFormat, string> = {
    pretty: "Pretty-printed JSON will appear here.",
    minified: "Minified JSON will appear here.",
    yaml: "YAML conversion will appear here.",
    toon: "Toon-encoded output will appear here.",
    toml: "TOML conversion will appear here.",
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Outputs</CardTitle>
        <CardDescription>
          View your data across the five formats. All outputs are derived live from the input JSON.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-1">
        <Tabs defaultValue="pretty" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="pretty">Original JSON</TabsTrigger>
            <TabsTrigger value="minified">Minified JSON</TabsTrigger>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
            <TabsTrigger value="toon">Toon</TabsTrigger>
            <TabsTrigger value="toml">TOML</TabsTrigger>
          </TabsList>

          {formats.map((format) => (
            <TabsContent key={format} value={format} className="space-y-2">
              <OutputTabContent
                format={format}
                output={outputs[format]}
                counts={counts[format]}
                showCounts={showCounts}
                showTokens={showTokens}
                showCopyReady={showCopyReady}
                tokenViewMode={tokenViewPerTab[format]}
                onTokenViewModeChange={(mode) => onTokenViewPerTabChange(format, mode)}
                tokens={tokens[format]}
                onCopyOutput={() => onCopyOutput(format)}
                onCopyTokenIds={() => onCopyTokenIds(format)}
                placeholder={placeholders[format]}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

