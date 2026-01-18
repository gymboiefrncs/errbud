import path from "node:path";
import type { NormalizedError } from "../types/Error.js";
import { extractMetadata } from "./utils.js";

export const normalizeError = (err: unknown): NormalizedError => {
  let name = "Error";
  let message = "An unexpected error occured";
  let rawStack: string[] | undefined;
  let metadata: Record<string, unknown> = {};
  const timestamp = new Date().toISOString();
  const raw = err;

  // extract name and message of the error
  if (err instanceof Error) {
    name = err.name;
    message = err.message;
    rawStack = err.stack
      ?.split("\n")
      .filter((frame) => frame.trim().includes("at"));
    metadata = extractMetadata(err);
  }

  const stack = rawStack?.map((trace) => {
    // remove "at "
    const trimmed = trace.trim().replace(/^at\s+/, "");

    // remove the parenthesis
    // this returns an array
    const insideParams =
      trimmed.match(/\((.*)\)/)?.[1] ??
      trimmed.match(/[a-zA-Z]:\\.*:\d+:\d+/)?.[0] ?? // grab the current working directory if the line has no parenthesis
      trimmed;

    // split it and grab the line and column
    const parts = insideParams.split(":");
    const file = parts.slice(0, -2).join(":");

    // get the relatvie path instead of absolute path (C:...) in windows
    const relativePath = path.relative(process.cwd(), file);

    let fn: string | undefined;
    if (trimmed.includes("(")) {
      fn = trimmed.split("(")[0]?.trim();
    } else if (!trimmed.includes("(")) {
      fn = trimmed.split(" ")[0]?.trim();
    } else {
      fn = "<anonymous>";
    }

    return {
      fn,
      file: relativePath,
      line: Number(parts?.at(-2)),
      column: Number(parts?.at(-1)),
    };
  });

  return { name, message, stack, metadata, timestamp, raw };
};
