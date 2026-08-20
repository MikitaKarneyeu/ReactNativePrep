The Fetch API is a modern JavaScript interface for making HTTP requests. It provides a more powerful and flexible alternative to `XMLHttpRequest` and returns Promises, making it compatible with async/await syntax.

**Basic usage:**

```javascript
// Simple GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// With async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

**The Response object:**

```javascript
const response = await fetch(url);

response.ok;          // true if status 200-299
response.status;      // HTTP status code (200, 404, 500, etc.)
response.statusText;  // Status text ("OK", "Not Found")
response.headers;     // Headers object
response.url;         // Final URL (after redirects)
response.redirected;  // true if response is from a redirect

// Reading the body (only one method can be called — body is a stream)
response.json();     // Parse as JSON
response.text();     // Read as text
response.blob();     // Read as Blob (for files/images)
response.arrayBuffer(); // Read as ArrayBuffer
response.formData(); // Read as FormData
```

**POST request with options:**

```javascript
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
});

const newUser = await response.json();
```

**Common request options:**

```javascript
fetch(url, {
  method: 'GET',           // GET, POST, PUT, DELETE, PATCH
  headers: { },            // Request headers
  body: null,              // Request body (string, FormData, Blob, etc.)
  mode: 'cors',            // cors, no-cors, same-origin
  credentials: 'same-origin', // omit, same-origin, include
  cache: 'default',        // default, no-store, reload, no-cache, force-cache
  redirect: 'follow',      // follow, error, manual
  signal: controller.signal // For cancellation
});
```

**Abort controller for cancellation:**

```javascript
const controller = new AbortController();

fetch(url, { signal: controller.signal })
  .then(response => response.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled');
    }
  });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

**Important notes:**

- Fetch only rejects on network errors, not on HTTP error status codes (404, 500). You must check `response.ok` or `response.status`.
- Fetch does not send cookies by default — use `credentials: 'include'` for cross-origin requests with cookies.
- Fetch does not have a built-in timeout — implement with `AbortController` and `setTimeout`.
- Headers and body handling differs between browser and Node.js implementations.

**Helper wrapper pattern:**

```javascript
async function apiFetch(url, options = {}) {
  const defaults = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  };
  
  const response = await fetch(url, { ...defaults, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}
```

The Fetch API is supported in all modern browsers and is the standard way to make HTTP requests in client-side JavaScript. For older browser support, libraries like `axios` or `whatwg-fetch` polyfill provide similar functionality.
