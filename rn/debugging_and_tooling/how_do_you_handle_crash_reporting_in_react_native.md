Crash reporting in React Native captures JavaScript errors, native crashes, and unhandled exceptions, sending them to a monitoring service for analysis. Proper crash reporting is essential for maintaining app quality in production.

**Setting up Sentry (most popular):**

```bash
npm install @sentry/react-native
```

```tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://your-dsn@sentry.io/project-id',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0, // Adjust for production
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});
```

**Capturing errors:**

```tsx
// Manual error capture
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Capture with context
Sentry.captureException(error, {
  tags: { feature: 'checkout' },
  extra: { orderId: '123', userId: '456' },
  level: 'error',
});

// Capture messages (non-errors)
Sentry.captureMessage('User completed onboarding', 'info');
```

**Error boundaries with Sentry:**

```tsx
import * as Sentry from '@sentry/react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

// Or use Sentry's wrapper
const SentryErrorBoundary = Sentry.wrap(ErrorBoundary);
```

**Setting user context:**

```tsx
// After login
Sentry.setUser({
  id: '123',
  email: 'user@example.com',
  username: 'alice',
});

// After logout
Sentry.setUser(null);
```

**Adding breadcrumbs:**

```tsx
// Automatic breadcrumbs for navigation, touches, etc.
// Manual breadcrumbs for custom events
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
  data: { method: 'email' },
});
```

**Native crash reporting:**

Sentry automatically captures native crashes (iOS/Android). For iOS, you need to upload debug symbols (dSYM):

```bash
# Upload dSYM after build
npx sentry-cli upload-dif --org your-org --project your-project ios/build/YourApp.app.dSYM
```

For Android, upload ProGuard mapping files:

```bash
npx sentry-cli upload-proguard android/app/build/outputs/mapping/release/mapping.txt
```

**Alternative: Bugsnag:**

```bash
npm install @bugsnag/react-native
```

```tsx
import Bugsnag from '@bugsnag/react-native';

Bugsnag.start({
  apiKey: 'your-api-key',
  onError: (event) => {
    event.addMetadata('app', { version: '1.0.0' });
  },
});
```

**Handling unhandled promise rejections:**

```tsx
// Sentry handles these automatically
// Or manually:
const originalHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  Sentry.captureException(error, {
    tags: { isFatal: String(isFatal) },
  });
  originalHandler(error, isFatal);
});
```

**Performance monitoring:**

```tsx
// Track custom transactions
const transaction = Sentry.startTransaction({ name: 'checkout' });
const span = transaction.startChild({ op: 'api.call' });

try {
  await api.processCheckout();
  span.setStatus('ok');
} catch (error) {
  span.setStatus('internal_error');
  Sentry.captureException(error);
} finally {
  span.finish();
  transaction.finish();
}
```

**Source maps for better stack traces:**

```bash
# Upload source maps to Sentry
npx sentry-cli releases files com.myapp@1.0.0 upload-sourcemap \
  --dist build-id \
  --strip-prefix /path/to/project \
  dist/main.jsbundle
```

**Best practices:**
- Set up crash reporting before your first release
- Use error boundaries to catch React rendering errors
- Include user context for debugging
- Add breadcrumbs for navigation and key actions
- Upload source maps and debug symbols for readable stack traces
- Set up alerts for new crash types
- Review crash reports regularly and fix high-impact issues
- Don't send sensitive data (passwords, tokens) in crash reports
- Use `beforeSend` to filter or modify events before sending
