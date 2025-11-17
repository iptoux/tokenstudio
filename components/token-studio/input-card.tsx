import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type InputCardProps = {
  input: string;
  onInputChange: (value: string) => void;
  error: string;
  onFileLoad: (file: File) => void;
};

export function InputCard({ input, onInputChange, error, onFileLoad }: InputCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          onInputChange(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="flex flex-col border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Input JSON</CardTitle>
            <CardDescription>Bring your payload; we handle format and token math.</CardDescription>
          </div>
          <Badge variant="outline" className="whitespace-nowrap">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Live validated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <Label htmlFor="json-input">Payload</Label>
          <Textarea
            id="json-input"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            spellCheck={false}
            className="min-h-[220px] font-mono text-xs md:text-sm"
            placeholder='{"hello": "world"}'
          />
        </div>
        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Parse error: {error}
          </p>
        )}
        <div className="mt-auto">
          <Button variant="outline" size="sm" className="w-full">
            <span className="mr-2">📋</span>
            Load sample
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileSelect(file);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}

