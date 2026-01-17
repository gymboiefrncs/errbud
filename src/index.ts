import { normalizeError } from "./lib/core.js";

try {
  throw new Error("Error occured");
} catch (e) {
  console.log(normalizeError(e));
}
