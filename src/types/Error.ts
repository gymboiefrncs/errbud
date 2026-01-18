export type StackFrame = {
  fn: string | undefined;
  file: string;
  line: number;
  column: number;
};

export type NormalizedError = {
  name: string;
  message: string;
  stack?: StackFrame[] | undefined;
  timestamp: string;
  metadata: Record<string, unknown>;
  raw: unknown;
};
