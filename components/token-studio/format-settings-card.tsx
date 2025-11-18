import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { EncodingFormat } from "@/lib/types";

type FormatSettingsCardProps = {
  encodingFormat: EncodingFormat;
  onEncodingFormatChange: (format: EncodingFormat) => void;
  showTokenAware: boolean;
  onShowTokenAwareChange: (value: boolean) => void;
  showCopyReady: boolean;
  onShowCopyReadyChange: (value: boolean) => void;
  showCounts: boolean;
  onShowCountsChange: (value: boolean) => void;
  showTokens: boolean;
  onShowTokensChange: (value: boolean) => void;
  showTokenCosts: boolean;
  onShowTokenCostsChange: (value: boolean) => void;
  onFileLoad: (file: File) => void;
};

export function FormatSettingsCard({
  encodingFormat,
  onEncodingFormatChange,
  showTokenAware,
  onShowTokenAwareChange,
  showCopyReady,
  onShowCopyReadyChange,
  showCounts,
  onShowCountsChange,
  showTokens,
  onShowTokensChange,
  showTokenCosts,
  // onShowTokenCostsChange is intentionally not destructured because the "Token costs" feature is not implemented yet
  onFileLoad,
}: FormatSettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="flex flex-col border-border/60 bg-card/60 dark:bg-card h-fit">
      <CardHeader>
        <CardTitle>Format and Token Comparison</CardTitle>
        <CardDescription>Compare the same payload as pretty JSON, minified JSON, YAML, TOON, and TOML.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={showTokenAware ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onShowTokenAwareChange(!showTokenAware)}
          >
            Token aware
          </Badge>
          <Badge
            variant={showCopyReady ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onShowCopyReadyChange(!showCopyReady)}
          >
            Copy-ready payloads
          </Badge>
          <Badge
            variant={showCounts ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onShowCountsChange(!showCounts)}
          >
            Character and byte counts
          </Badge>
          <Badge
            variant={showTokens ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onShowTokensChange(!showTokens)}
          >
            Show tokens
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={showTokenCosts ? "default" : "outline"}
                  className="cursor-not-allowed opacity-60"
                  aria-disabled={true}
                >
                  Token costs
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Not implemented yet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="encoding">ENCODING</Label>
            <Select
              value={encodingFormat}
              onValueChange={(value) => onEncodingFormatChange(value as EncodingFormat)}
            >
              <SelectTrigger id="encoding" className="w-full">
                <SelectValue placeholder="Select encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base64">base64</SelectItem>
                <SelectItem value="hex">hex</SelectItem>
                <SelectItem value="url-safe">url-safe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/40 cursor-pointer"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-primary", "bg-primary/5");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-primary", "bg-primary/5");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-primary", "bg-primary/5");
              const file = e.dataTransfer.files[0];
              if (file) {
                onFileLoad(file);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileLoad(file);
                }
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl">↓</div>
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                Paste or load sample JSON on the left to see how tokens and bytes shift across formats.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

