Sentry is an error monitoring and performance tracking platform that captures crashes, errors, and performance issues in production React Native apps. It provides detailed stack traces, user context, breadcrumbs, and release tracking.

**Why Sentry for React Native:**
- Captures both JavaScript and native (iOS/Android) crashes
- Excellent React Native support with source map integration
- Performance monitoring and profiling
- Release health tracking (crash-free rate per release)
- Rich context: device info, user info, breadcrumbs, tags
- Alerting and issue management workflow

**Installation:**

```bash
# Install
npm install @sentry/react-native

# Run the setup wizard
npx @sentry/wizard@latest -i reactNative

# This automatically:
# - Updates native iOS and Android projects
# - Configures source map uploads
# - Sets up build scripts
```

**Basic setup:**

```tsx
// index.js (entry point)
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0.2, // Sample 20% of transactions in production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
    }),
  ],
});

// Register your app component
import { AppRegistry } from 'react-native';
import App from './App';

Sentry.wrap(App);
AppRegistry.registerComponent('MyApp', () => App);
```

**Capturing errors:**

```tsx
// Capture exceptions
try {
  await api.call();
} catch (error) {
  Sentry.captureException(error);
}

// Capture messages
Sentry.captureMessage('Something unusual happened', 'warning');

// With context
Sentry.captureException(error, {
  tags: {
    feature: 'checkout',
    platform: Platform.OS,
  },
  extra: {
    orderId: '12345',
    cartItems: cart.length,
  },
  level: 'error',
});
```

**User identification:**

```tsx
// Set user context
Sentry.setUser({
  id: '123',
  email: 'user@example.com',
  username: 'alice',
  segment: 'premium',
});

// Clear on logout
Sentry.setUser(null);
```

**Breadcrumbs:**

```tsx
// Automatic breadcrumbs: navigation, HTTP requests, touches

// Manual breadcrumbs
Sentry.addBreadcrumb({
  category: 'ui.click',
  message: 'User tapped checkout button',
  level: 'info',
  data: { total: 99.99 },
});

Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to PaymentScreen',
  level: 'info',
});
```

**Performance monitoring:**

```tsx
// Automatic: HTTP requests, navigation transitions

// Custom transactions
const transaction = Sentry.startTransaction({
  name: 'ProductLoad',
  op: 'task',
});

const span = transaction.startChild({
  op: 'http',
  description: 'GET /api/products',
});

const response = await fetch('/api/products');
span.setData('statusCode', response.status);
span.finish();

transaction.finish();
```

**React Navigation integration:**

```tsx
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: '...',
  integrations: [
    new Sentry.ReactNativeTracing({ routingInstrumentation }),
  ],
});

function App() {
  const navigationRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigationRef);
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
```

**Error boundaries:**

```tsx
import * as Sentry from '@sentry/react-native';

class MyErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }
  render() {
    return this.props.hasError ? <ErrorScreen /> : this.props.children;
  }
}

const SentryBoundary = Sentry.wrap(MyErrorBoundary);
```

**Source map uploads (critical for readable stack traces):**

```bash
# Upload during CI/CD build
npx sentry-cli \
  --auth-token YOUR_TOKEN \
  releases files com.myapp@1.0.0+1 \
  upload-sourcemap dist/main.jsbundle \
  --dist build123 \
  --strip-prefix /path/to/project
```

**Release health:**

```tsx
Sentry.init({
  dsn: '...',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});

// Sentry automatically tracks:
// - Crash-free sessions
// - Crash-free users
// - Release adoption
// - User impact per issue
```

**Best practices:**
- Initialize Sentry as early as possible (first line of index.js)
- Set `tracesSampleRate` lower in production (0.1-0.2) to control costs
- Always upload source maps and dSYMs for readable stack traces
- Use `Sentry.wrap()` for automatic error boundary and performance tracking
- Tag events with feature areas and user segments
- Set up alerts for new issues and crash rate regressions
- Review and resolve issues regularly
- Use `beforeSend` to strip sensitive data from events
