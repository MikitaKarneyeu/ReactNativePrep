JSI (JavaScript Interface) is the low-level C++ layer in React Native's New Architecture that replaces the bridge. It provides direct, synchronous communication between JavaScript and native code without serialization.

**How JSI works:**

JSI allows JavaScript to hold direct references to C++ objects (called host objects) on the native heap. Instead of serializing function calls to JSON and sending them over a bridge, JS code can call methods on these C++ objects directly, as if they were regular JS objects.

```cpp
// C++ host object exposed via JSI
class NativeModule : public jsi::HostObject {
  jsi::Value get(jsi::Runtime& runtime, const jsi::PropNameID& name) override {
    if (name.utf8(runtime) == "getData") {
      return jsi::Function::createFromHostFunction(
        runtime, name, 1,
        [](jsi::Runtime& rt, const jsi::Value&,
           const jsi::Value* args, size_t) -> jsi::Value {
          // Direct native execution, no bridge
          std::string result = fetchDataFromNative();
          return jsi::String::createFromUtf8(rt, result);
        }
      );
    }
    return jsi::Value::undefined();
  }
};
```

**Performance improvements:**

1. **Synchronous calls**: JS can call native methods and get results immediately without Promises or callbacks. This is critical for operations that need instant feedback, like reading layout information or accessing device capabilities.

2. **No serialization overhead**: The bridge required every message to be serialized to JSON on one side and deserialized on the other. JSI eliminates this entirely by sharing memory through C++ object references.

3. **Direct memory access**: JSI can expose C++ objects as JavaScript objects, meaning you can read/write properties directly. This is how Fabric and TurboModules communicate with native code.

4. **Runtime agnostic**: JSI abstracts the JavaScript engine, allowing React Native to work with different JS engines (JavaScriptCore, Hermes, V8) without changing native code.

5. **Enables shared ownership**: C++ objects can be referenced from both JS and native code, enabling patterns like shared ArrayBuffers for zero-copy data transfer.

**JSI powers both Fabric and TurboModules:**
- **Fabric** uses JSI to let JS directly call rendering methods and read layout results synchronously.
- **TurboModules** use JSI to expose native module methods as direct function calls from JS.

JSI is the foundational technology that makes the New Architecture's performance gains possible. It was the single biggest architectural change, moving React Native from an asynchronous bridge model to a synchronous, shared-memory model.
