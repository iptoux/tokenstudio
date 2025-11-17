import type { TokenCounts } from "@/lib/types";

type CountsDisplayProps = {
  counts: TokenCounts;
};

export function CountsDisplay({ counts }: CountsDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-md border border-border/60 bg-muted p-2 text-xs text-muted-foreground">
        <div className="font-medium">Tokens</div>
        <div className="tabular-nums">{counts.tokens}</div>
      </div>

      <div className="rounded-md border border-border/60 bg-muted p-2 text-xs text-muted-foreground">
        <div className="font-medium">Characters</div>
        <div className="tabular-nums">{counts.chars}</div>
      </div>

      <div className="rounded-md border border-border/60 bg-muted p-2 text-xs text-muted-foreground">
        <div className="font-medium">Bytes</div>
        <div className="tabular-nums">{counts.bytes}</div>
      </div>
    </div>
  );
}

