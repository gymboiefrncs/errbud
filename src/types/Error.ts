export type StackFrame = {
  fn: string;
  file: string;
  line: number;
  column: number;
};

export type NormalizedError = {
  error: string;
  message: string;
  stack: StackFrame[] | undefined;
  timestamp: string;
  metadata: Record<string, unknown>;
  raw: unknown;
};
