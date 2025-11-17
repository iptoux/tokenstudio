import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">• TOKEN STUDIO</Badge>
        </div>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          JSON to YAML to TOON
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Paste JSON, explore alternate formats, and see how token counts change for different encodings.
        </p>
      </div>
    </header>
  );
}

