Native modules are pieces of platform-specific code written in Swift/Objective-C (iOS) or Kotlin/Java (Android) that are exposed to JavaScript in React Native. They allow you to access platform APIs and native functionality that isn't available through the built-in React Native components.

**When you need native modules:**
- Accessing platform-specific APIs (health data, Bluetooth, custom sensors)
- Using existing native libraries written in Swift/Kotlin
- Performance-critical operations that are too slow in JS
- Integrating with platform-specific SDKs (payment processors, analytics)

**Creating a Native Module (TurboModule - New Architecture):**

Step 1: Define a TurboModule spec in TypeScript:

```typescript
// src/modules/NativeCalculator.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  multiply(a: number, b: number): number; // synchronous
}

export default TurboModuleRegistry.getEnforcing<Spec>('Calculator');
```

Step 2: Implement in Kotlin (Android):

```kotlin
// android/app/src/main/java/com/myapp/CalculatorModule.kt
package com.myapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod

class CalculatorModule(reactContext: ReactApplicationContext) :
    NativeCalculatorSpec(reactContext) {

    override fun add(a: Double, b: Double, promise: Promise) {
        promise.resolve(a + b)
    }

    override fun multiply(a: Double, b: Double): Double {
        return a * b
    }
}
```

Step 3: Implement in Swift (iOS):

```swift
// ios/CalculatorModule.swift
@objc(CalculatorModule)
class CalculatorModule: NSObject {
  @objc func multiply(_ a: Double, b: Double) -> Double {
    return a * b
  }

  @objc func add(_ a: Double, b: Double,
                  resolve: RCTPromiseResolveBlock,
                  reject: RCTPromiseRejectBlock) {
    resolve(a + b)
  }
}
```

Step 4: Use in JavaScript:

```typescript
import Calculator from './src/modules/NativeCalculator';

const result = Calculator.multiply(3, 4); // 12 (synchronous)
const sum = await Calculator.add(5, 3);   // 8 (async/Promise)
```

**Old Architecture Native Modules** used `RCT_EXPORT_METHOD` macros and `@ReactMethod` annotations without codegen. They required manual serialization and were all asynchronous through the bridge.

**Key differences with TurboModules:**
- Lazy loading (loaded on demand, not at startup)
- Synchronous method support via JSI
- Type-safe codegen from TypeScript/Flow specs
- Direct JSI calls instead of bridge serialization

For most common device features, you should first check if an existing community package or Expo module already provides what you need before writing a custom native module.
