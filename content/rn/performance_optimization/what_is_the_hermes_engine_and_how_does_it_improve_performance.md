Hermes is an open-source JavaScript engine developed by Meta, specifically optimized for React Native. It is the default JS engine for React Native on Android and iOS (since React Native 0.70+), replacing JavaScriptCore (JSC) for most use cases.

**How Hermes improves performance:**

**1. Ahead-of-Time (AOT) compilation**: Hermes compiles JavaScript source code into bytecode during the build process (at app build time), rather than parsing and compiling at runtime. This means:
- Faster app startup (up to 2x improvement in Time to Interactive)
- The JS engine doesn't need to parse source code on device
- Bytecode is optimized during the build step

```
Development: JS source → Metro bundle → Hermes bytecode → App bundle
Runtime: Bytecode → Direct execution (no parsing/compilation)
```

**2. Optimized for mobile**: Hermes was designed from scratch for mobile devices with constrained resources:
- Lower memory footprint than JavaScriptCore
- Efficient garbage collection with concurrent GC that doesn't block the main thread
- Startup-optimized execution model

**3. Compact bytecode format**: Hermes bytecode is smaller than minified JavaScript, reducing app bundle size.

**4. Startup execution optimization**: Hermes uses an interpreter that's optimized for startup patterns. It defers compilation of less-frequently-used code paths, focusing resources on the startup-critical path.

**Enabling Hermes:**

For React Native 0.70+, Hermes is the default engine. For older versions or if you need to verify:

**iOS** (in `ios/Podfile`):
```ruby
:hermes_enabled => true
```

**Android** (in `android/gradle.properties`):
```properties
hermesEnabled=true
```

**Verifying Hermes is active:**
```tsx
const isHermes = () => !!global.HermesInternal;
console.log('Hermes enabled:', isHermes());
```

**Hermes vs JavaScriptCore:**

| Aspect | Hermes | JavaScriptCore |
|---|---|---|
| Startup time | Significantly faster | Slower (parses JS at runtime) |
| Memory usage | Lower | Higher |
| Bundle size | Smaller (bytecode) | Larger (JS source) |
| AOT compilation | Yes | No |
| Garbage collection | Concurrent, non-blocking | Can cause jank |
| Debugging | Chrome DevTools, Flipper | Safari, Flipper |

**Hermes and the New Architecture**: Hermes works seamlessly with JSI. In the New Architecture, JSI provides the interface layer, and Hermes is the JavaScript engine behind it. This combination enables direct C++ object access from JavaScript without serialization.

**Hermes debugging tools:**
- Chrome DevTools for debugging (connects via the Hermes debugger)
- Source maps for mapping bytecode back to original source
- Hermes sampling profiler for performance analysis

```tsx
// Enable Hermes sampling profiler programmatically
const HermesInternal = global.HermesInternal;
if (HermesInternal) {
  HermesInternal.enable();
  // ... run code to profile ...
  HermesInternal.disable();
}
```

**Common issues:**
- Some npm packages with native extensions may not be compatible with Hermes
- Debugging bytecode directly is harder than debugging JS source (source maps solve this)
- Edge cases in newer JavaScript features may have different behavior than JSC

Hermes is one of the single biggest performance improvements for React Native apps and should always be enabled.
