import { normalizeError, formatError } from "./lib/core.js";

const test = () => {
  try {
    throw new Error("Error occured");
  } catch (e) {
    console.log(normalizeError(e));
    console.log(formatError(normalizeError(e)));
  }
};

test();
