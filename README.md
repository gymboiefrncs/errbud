# errBud

A lightweight TypeScript error handling library that normalizes and formats errors with enhanced stack traces and metadata extraction.

## Features

- **Error Normalization**: Convert any error into a consistent, structured format
- **Stack Trace Parsing**: Enhanced stack trace parsing that distinguishes between user code and Node.js internals
- **Metadata Extraction**: Automatically extract custom properties from error objects
- **Formatted Output**: Generate clean, readable error messages with contextual information
- **TypeScript Support**: Full type safety with built-in TypeScript definitions
- **Relative Path Resolution**: Displays file paths relative to the current working directory

## Installation

```bash
pnpm add errbud
```

## Usage

### Basic Error Normalization

```typescript
import { normalizeError, formatError } from "errbud";

try {
  throw new Error("Something went wrong!");
} catch (err) {
  const normalized = normalizeError(err);
  console.log(normalized);
  // Output:
  // {
  //   name: 'Error',
  //   message: 'Something went wrong!',
  //   stack: [...],
  //   metadata: {},
  //   timestamp: '2026-01-18T10:30:45.123Z',
  //   raw: Error object
  // }
}
```

### Formatted Error Output

```typescript
import { normalizeError, formatError } from "errbud";

try {
  throw new Error("Database connection failed");
} catch (err) {
  const normalized = normalizeError(err);
  const formatted = formatError(normalized);
  console.log(formatted);
}
```

Output:

```
Error: Database connection failed
    [USER] handleConnection (src/db.ts:15:10)
    [INT] Module._load (node:internal/modules/cjs/loader:1126:42)
```

### Custom Error Properties

errBud automatically extracts custom properties attached to error objects:

```typescript
const customErr = new Error("Custom error");
customErr.code = "ERR_CUSTOM";
customErr.context = { userId: 123 };

const normalized = normalizeError(customErr);
console.log(normalized.metadata);
// Output: { code: 'ERR_CUSTOM', context: { userId: 123 } }
```

## API

### `normalizeError(err: unknown): NormalizedError`

Converts any error into a normalized structure.

**Parameters:**

- `err`: Any value (typically an Error object)

**Returns:** `NormalizedError` object with:

- `name`: Error name
- `message`: Error message
- `stack`: Array of `StackFrame` objects with function, file, line, and column information
- `metadata`: Custom properties extracted from the error
- `timestamp`: ISO string of when the error was normalized
- `raw`: The original error object

### `formatError(err: NormalizedError): string`

Formats a normalized error into a readable string.
