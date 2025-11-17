export type EncodingFormat = "base64" | "hex" | "url-safe";

export type Counts = {
  chars: number;
  bytes: number;
};

export type TokenCounts = Counts & {
  tokens: number;
};

export type Token = {
  id: number;
  text: string;
};

export type TokenWithPosition = Token & {
  start: number;
  end: number;
};

export type SimpleToken = {
  id: number | null;
  text: string;
  start: number;
  end: number;
};

export type OutputFormat = "pretty" | "minified" | "yaml" | "toon";

export type TokenViewMode = "text" | "ids";

export type TokenViewPerTab = Record<OutputFormat, TokenViewMode>;

export type ToonDelimiter = "," | "\t" | "|";

export type ToonKeyFolding = "off" | "safe";

export type TokenizationModel = "cl100k_base" | string;

export type ExactTokens = Record<OutputFormat, Token[]>;

export type TokenizeRequestBody = {
  model: string;
  texts: Record<OutputFormat, string | undefined>;
};

export type TokenizeResponseBody = {
  model: string;
  tokens: Record<OutputFormat, Token[]>;
};

export type TokenizeErrorResponse = {
  error?: string;
};

