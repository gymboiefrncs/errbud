import path from "node:path";
import type { NormalizedError } from "../types/Error.js";

export const normalizeError = (err: unknown): NormalizedError => {
  let error = "Error";
  let message = "An unexpected error occured";
  let rawStack: string[] | undefined;

  // extract name and message of the error
  if (err instanceof Error) {
    error = err.name;
    message = err.message;
    rawStack = err.stack
      ?.split("\n")
      .filter((frame) => frame.trim().includes("at"));
  }

  const stack = rawStack?.map((trace) => {
    // remove "at "
    const trimmed = trace.trim().replace(/^at\s+/, "");

    // remove the parenthesis
    // this returns an array
    const insideParams = trimmed.match(/\((.*)\)/)?.[1];

    // split it and grab the line and column
    const parts = insideParams?.split(":");
    const file = parts?.slice(0, -2).join(":");

    // get the relatvie path instead of absolute path (C:...) in windows
    const relativePath = path.relative(process.cwd(), file!);

    return {
      fn: trimmed.includes("(") ? trimmed.split("(")[0]?.trim() : "<anonymous>",
      file: relativePath,
      line: Number(parts?.at(-2)),
      column: Number(parts?.at(-1)),
    };
  });

  return { error, message, stack };
};
