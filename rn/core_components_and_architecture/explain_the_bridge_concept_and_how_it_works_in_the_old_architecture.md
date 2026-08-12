The bridge was the central communication mechanism in React Native's old architecture, enabling asynchronous message passing between the JavaScript thread and the native (UI) thread.

**How it worked:**

React Native runs three main threads:
1. **JS Thread**: Executes your React component code, business logic, and the React reconciliation.
2. **Main/UI Thread**: Handles native UI rendering, layout, and user interactions.
3. **Shadow Thread**: Computes layout using Yoga (Facebook's cross-platform layout engine).

The bridge was an asynchronous, serialized, batched message queue between these threads. When JavaScript needed to call a native method or update the UI, it would serialize the call into JSON, place it on the bridge queue, and the native side would deserialize and execute it when the batch was flushed.

**The communication flow:**

1. **JS → Native (NativeModules)**: When you called a native module method (e.g., `NativeModules.CalendarModule.getEvents()`), the call was serialized to JSON, sent over the bridge, and deserialized on the native side.
2. **Native → JS**: Native code could send events back through the bridge using `RCTEventEmitter` or `sendEventWithName`.
3. **Rendering**: When React reconciled the virtual DOM, diff results were serialized and sent through the bridge to the native UI manager, which then updated the actual native views.

```js
// Old Native Module call flow:
// JS Thread → (serialize to JSON) → Bridge Queue → (deserialize) → Native Thread
NativeModules.MyModule.doSomething('param');
```

**Limitations of the bridge:**

- **Asynchronous only**: No way to make synchronous calls from JS to native. If you needed a value from native, you had to use a Promise or callback, adding latency.
- **Serialization overhead**: Every message was serialized to JSON and deserialized on the other side. For high-frequency operations like animations or gestures, this created jank.
- **Batching latency**: Messages were batched, so there was inherent delay between JS requesting something and native executing it.
- **Single bridge bottleneck**: All communication funneled through one bridge, creating a throughput limit during heavy UI updates.

These limitations motivated the creation of JSI in the New Architecture, which replaced the bridge with direct C++ object references, enabling synchronous, zero-overhead communication between JS and native code.
