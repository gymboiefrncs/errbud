export const extractMetadata = (err: unknown): Record<string, unknown> => {
  const metadata: Record<string, unknown> = {};

  // Cast to Record for safe iteration
  const errorObj = err as unknown as Record<string, unknown>;
  const keys = Object.getOwnPropertyNames(err);

  for (const key of keys) {
    if (["name", "message", "stack", "cause"].includes(key)) continue;

    metadata[key] = errorObj[key];
  }

  return metadata;
};
