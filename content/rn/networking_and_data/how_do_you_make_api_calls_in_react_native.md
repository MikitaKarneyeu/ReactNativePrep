API calls in React Native are made using standard JavaScript networking APIs, as React Native includes a built-in `fetch` API. You can also use third-party libraries like Axios for more features.

**Using fetch (built-in):**

```tsx
// GET request
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// POST request
async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}
```

**Using Axios:**

```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth tokens
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

// Usage
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
```

**With React hooks for component integration:**

```tsx
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

**Using TanStack Query (recommended for production):**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UsersScreen() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserCard user={item} />}
    />
  );
}
```

**Error handling best practices:**

```tsx
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: 10000,
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(response.status, errorBody);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    if (error.message === 'Network request failed') {
      throw new Error('No internet connection');
    }
    throw error;
  }
}
```

**Platform considerations:**
- React Native uses the same networking stack as the platform (NSURLSession on iOS, OkHttp on Android)
- No CORS restrictions (unlike web)
- Background fetch is available but requires native configuration
- Use `AbortController` for request cancellation
- Consider using `react-native-background-fetch` for periodic background tasks
