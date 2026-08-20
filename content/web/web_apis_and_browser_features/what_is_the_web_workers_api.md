The Web Workers API enables JavaScript to run scripts in background threads, separate from the main execution thread. This allows computationally intensive tasks to run without blocking the UI, keeping the page responsive.

**Creating a web worker:**

```javascript
// main.js
const worker = new Worker('worker.js');

// Send data to the worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5], operation: 'sum' });

// Receive data from the worker
worker.onmessage = (event) => {
  console.log('Result:', event.data); // 15
};

// Handle errors
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
};

// Terminate the worker
worker.terminate();
```

```javascript
// worker.js — runs in a separate thread
self.onmessage = (event) => {
  const { numbers, operation } = event.data;

  let result;
  if (operation === 'sum') {
    result = numbers.reduce((acc, n) => acc + n, 0);
  }

  // Send result back to the main thread
  self.postMessage(result);
};
```

**Types of workers:**

**Dedicated workers** — Used by a single script/page:
```javascript
const worker = new Worker('worker.js');
```

**Shared workers** — Can be shared between multiple scripts/windows:
```javascript
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.start();
sharedWorker.port.postMessage('Hello');
sharedWorker.port.onmessage = (e) => console.log(e.data);
```

**Service workers** — Act as network proxies for offline support and caching:
```javascript
// Register a service worker
navigator.serviceWorker.register('/sw.js');
```

**What workers can and cannot do:**

Workers CAN:
- Perform computations (math, data processing, sorting)
- Make network requests (fetch, XMLHttpRequest)
- Use timers (setTimeout, setInterval)
- Access `navigator`, `location` (read-only), `console`
- Use `importScripts()` to load external scripts
- Use `TextEncoder`, `TextDecoder`, `JSON`, `Math`
- Create sub-workers

Workers CANNOT:
- Access the DOM (no `document`, no `window` DOM methods)
- Access the parent page's variables or functions
- Access `localStorage` or `sessionStorage` (use IndexedDB instead)
- Manipulate the UI directly

**Communicating with structured data:**

```javascript
// Using Transferable objects for zero-copy transfer (performance)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB buffer
worker.postMessage(buffer, [buffer]); // Transfers ownership, not copies
// buffer.byteLength is now 0 in the main thread

// Using SharedArrayBuffer for shared memory (requires special headers)
const sharedBuffer = new SharedArrayBuffer(1024);
const view = new Int32Array(sharedBuffer);
view[0] = 42;
worker.postMessage(sharedBuffer);
```

**Inline worker using Blob URLs:**

```javascript
const workerCode = `
  self.onmessage = (e) => {
    const result = e.data * 2;
    self.postMessage(result);
  };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);

worker.onmessage = (e) => console.log(e.data);
worker.postMessage(21); // 42

// Clean up
URL.revokeObjectURL(workerUrl);
```

**Practical use cases:**

1. **Image processing** — Apply filters, resize, compress images
2. **Data processing** — Sort, filter, transform large datasets
3. **Crypto operations** — Hashing, encryption, decryption
4. **Parsing** — Parse large JSON, XML, CSV files
5. **Physics simulations** — Game physics, particle systems
6. **Search/filter** — Full-text search through large collections
7. **Compression** — Gzip/deflate operations

**Best practices:**

- Keep message payloads small — serializing large objects is expensive
- Use Transferable objects for large binary data
- Consider using a worker pool for multiple concurrent tasks
- Terminate workers when done to free resources
- Use `structuredClone()` for deep copying complex objects before sending
- Service workers require HTTPS in production
