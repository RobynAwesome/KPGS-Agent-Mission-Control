type WebMCPToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
};

type WebMCPTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: WebMCPToolAnnotations;
  execute(input: unknown): unknown | Promise<unknown>;
};

type WebMCPRegisterOptions = {
  signal?: AbortSignal;
};

interface ModelContext {
  registerTool(tool: WebMCPTool, options?: WebMCPRegisterOptions): void | Promise<void>;
}

interface Document {
  readonly modelContext?: ModelContext;
}
