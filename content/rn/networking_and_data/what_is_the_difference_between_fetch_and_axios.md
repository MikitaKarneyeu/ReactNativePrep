`fetch` and `axios` are the two most common ways to make HTTP requests in React Native. While both accomplish the same goal, they differ in features, error handling, and developer experience.

**fetch** is built into React Native (no installation needed):

```tsx
// Basic fetch usage
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// With options
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
});
```

**axios** is a third-party library (requires `npm install axios`):

```tsx
import axios from 'axios';

const { data } = await axios.get('https://api.example.com/data');
const result = await axios.post('https://api.example.com/data', { key: 'value' });
```

**Key differences:**

| Feature | fetch | axios |
|---|---|---|
| Installation | Built-in | Requires npm install |
| JSON parsing | Manual (`response.json()`) | Automatic |
| Error handling | Only throws on network errors | Throws on non-2xx status |
| Request cancellation | `AbortController` | Built-in `CancelToken` or `AbortController` |
| Interceptors | Not built-in | Built-in request/response interceptors |
| Progress tracking | Not built-in | Built-in upload/download progress |
| Timeout | Manual implementation | Built-in `timeout` option |
| Base URL | Manual implementation | Built-in `baseURL` config |
| Transform | Manual | Automatic request/response transforms |

**Error handling differences:**

```tsx
// fetch - does NOT throw on 4xx/5xx
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

// axios - throws automatically on non-2xx
try {
  await axios.get(url);
} catch (error) {
  // error.response.status contains the HTTP status
  // error.response.data contains the response body
}
```

**Interceptors with axios:**

```tsx
// Add auth token to all requests
axios.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      refreshToken();
    }
    return Promise.reject(error);
  }
);
```

**Timeout with fetch (manual):**

```tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    console.log('Request timed out');
  }
}
```

**Timeout with axios (built-in):**

```tsx
const response = await axios.get(url, { timeout: 5000 });
```

**Progress tracking with axios:**

```tsx
await axios.post('/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Upload progress: ${percent}%`);
  },
});
```

**Creating reusable instances:**

```tsx
// axios - clean instance creation
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// fetch - manual wrapper needed
const api = {
  get: (url) => fetch(`${BASE_URL}${url}`).then(handleResponse),
  post: (url, data) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
```

**When to use each:**

**Use fetch when:**
- You want zero dependencies
- You need simple, infrequent API calls
- You're building a small app or prototype

**Use axios when:**
- You need interceptors for auth token management
- You want automatic error handling on non-2xx responses
- You need request/response transformation
- You need upload/download progress tracking
- You're building a production app with many API endpoints

For most production React Native apps, axios is preferred for its better developer experience and built-in features. TanStack Query wraps either fetch or axios and adds caching, deduplication, and more.
