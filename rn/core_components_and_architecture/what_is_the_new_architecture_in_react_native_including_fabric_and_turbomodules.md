React Native's New Architecture is a complete rewrite of the internal communication layer between JavaScript and native code. It was designed to eliminate the asynchronous bridge bottleneck and improve performance, type safety, and flexibility.

**The Old Architecture Problem**: The previous architecture used a serialized JSON bridge to communicate between JS and native threads. This bridge was asynchronous and batched messages, creating latency and preventing synchronous native calls from JS.

**The New Architecture has four key pillars:**

**1. JSI (JavaScript Interface)**: JSI replaces the bridge entirely. Instead of serializing messages to JSON, JSI allows JavaScript to hold direct references to C++ objects (host objects) and call methods on them synchronously. This eliminates serialization overhead and enables synchronous native calls.

**2. Fabric**: Fabric is the new rendering system that replaces the old UI manager. Instead of the JS thread sending asynchronous layout and rendering commands through the bridge, Fabric uses JSI to synchronously communicate with the native rendering layer. This enables:
- Synchronous rendering where JS can read layout information immediately
- Concurrent rendering support (React 18 concurrent features)
- Simpler threading model—rendering can happen on any thread
- Better integration with React's concurrent features like Suspense and transitions

**3. TurboModules**: TurboModules replace the old Native Modules system. They are lazy-loaded (only loaded when called, not at startup), use JSI for direct synchronous calls, and are strongly typed with codegen. This means:
- Faster startup because modules load on demand
- Type-safe communication via generated interfaces (TypeScript/Flow → C++/Java/ObjC)
- Synchronous method calls from JS to native

**4. Codegen**: A static type system that generates interface code from JavaScript type definitions (Flow or TypeScript). This ensures type safety between JS and native code and eliminates runtime type checking.

```js
// TurboModule spec example (TypeScript)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getConstants(): { DEFAULT_TIMEOUT: number };
  fetchData(url: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NetworkModule');
```

The New Architecture is now the default in React Native 0.76+. It provides measurable performance improvements, especially in startup time, list scrolling, and animation-heavy screens.
