import { Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { OutputFormat, TokenViewMode } from "@/lib/types";
import type { TokenForDisplay } from "@/lib/utils/tokenization";
import { getTokenIds } from "@/lib/utils/tokenization";

type OutputActionsProps = {
  showTokens: boolean;
  showCopyReady: boolean;
  tokenViewMode: TokenViewMode;
  onTokenViewModeChange: (mode: TokenViewMode) => void;
  onCopyOutput: () => void;
  onCopyTokenIds: () => void;
  hasOutput: boolean;
  tokens: TokenForDisplay[] | undefined;
};

export function OutputActions({
  showTokens,
  showCopyReady,
  tokenViewMode,
  onTokenViewModeChange,
  onCopyOutput,
  onCopyTokenIds,
  hasOutput,
  tokens,
}: OutputActionsProps) {
  const tokenIds = tokens ? getTokenIds(tokens) : [];
  const hasTokenIds = tokenIds.length > 0;

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        {showTokens && (
          <>
            <Badge
              variant={tokenViewMode === "text" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTokenViewModeChange("text")}
            >
              Text
            </Badge>
            <Badge
              variant={tokenViewMode === "ids" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTokenViewModeChange("ids")}
            >
              Token IDs
            </Badge>
          </>
        )}
        {showCopyReady && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopyOutput}
                  disabled={!hasOutput}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy output</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {showTokens && showCopyReady && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopyTokenIds}
                  disabled={!hasTokenIds}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy token IDs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

