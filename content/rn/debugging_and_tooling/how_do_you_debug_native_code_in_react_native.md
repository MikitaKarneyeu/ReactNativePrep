Debugging native code in React Native requires platform-specific tools. While most bugs can be debugged at the JavaScript level, some issues—crashes, native module behavior, performance problems—require stepping through native code.

**iOS debugging with Xcode:**

**1. Opening the project in Xcode:**
```bash
open ios/YourApp.xcworkspace
```

**2. Setting breakpoints in native code:**
- Open your Swift/Objective-C files in Xcode
- Click on a line number to set a breakpoint
- Run the app in debug mode (Product → Run or `Cmd + R`)

**3. Debugging native modules:**

```swift
// Your native module
@objc(MyModule)
class MyModule: NSObject {
  @objc func fetchData(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    // Set breakpoint here to debug native code
    let task = URLSession.shared.dataTask(with: URL(string: url)!) { data, response, error in
      if let error = error {
        reject("FETCH_ERROR", error.localizedDescription, error)
        return
      }
      resolve(String(data: data!, encoding: .utf8))
    }
    task.resume()
  }
}
```

**4. Viewing console output:**
- Xcode's Debug Console shows `NSLog` and `print` output
- Use `po` (print object) in the console to inspect variables:
```
(lldb) po response
(lldb) po error?.localizedDescription
```

**5. Memory debugging:**
- Use Xcode's Memory Graph Debugger to find retain cycles
- Use Instruments (Product → Profile) for memory leaks

**Android debugging with Android Studio:**

**1. Opening the project:**
```
Open Android Studio → Open → select android/ folder
```

**2. Setting breakpoints:**
- Open your Kotlin/Java files
- Click on line numbers to set breakpoints
- Run in debug mode (Debug button or `Shift + F9`)

**3. Debugging native modules:**

```kotlin
class MyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    @ReactMethod
    fun fetchData(url: String, promise: Promise) {
        // Set breakpoint here
        try {
            val response = URL(url).readText()
            promise.resolve(response)
        } catch (e: Exception) {
            promise.reject("FETCH_ERROR", e.message, e)
        }
    }
}
```

**4. Logcat:**
Android's system log shows all log output:
```bash
# Filter for your app
adb logcat --pid=$(adb shell pidof -s com.yourapp)
```

**5. Android Studio Profiler:**
- CPU Profiler: Analyze CPU usage and thread activity
- Memory Profiler: Track memory allocations and leaks
- Network Profiler: Inspect network traffic

**Debugging crashes:**

**iOS crash logs:**
- Xcode → Window → Devices and Simulators → View Device Logs
- Or use `Console.app` to view real-time logs

**Android crash logs:**
```bash
adb logcat *:E | grep -i "fatal\|crash\|exception"
```

**Common native debugging scenarios:**

**1. Native module crashes:**
```tsx
// Add error handling in your native module
@ReactMethod
fun riskyOperation(promise: Promise) {
    try {
        // Potentially crashing code
        val result = doSomethingRisky()
        promise.resolve(result)
    } catch (e: Exception) {
        Log.e("MyModule", "Error in riskyOperation", e)
        promise.reject("ERROR", e.message, e)
    }
}
```

**2. Memory leaks:**
- Use Xcode's Leaks instrument
- Use Android Studio's Memory Profiler
- Look for retain cycles in native modules

**3. Thread safety:**
- Check if native module methods are called on the correct thread
- Use `@ReactMethod(isBlockingSynchronousMethod = true)` carefully

**4. Layout issues:**
- Use Xcode's View Debugger (Debug → View Debugging → Capture View Hierarchy)
- Use Android Studio's Layout Inspector

**Debugging with Flipper:**

Flipper provides a bridge between JS debugging and native inspection:
- View native view hierarchy
- Inspect native logs
- Monitor network traffic at the native level

**Best practices:**
- Keep native modules simple—move logic to JS when possible
- Add proper error handling and logging in native code
- Use platform-specific debuggers for native issues
- Test on real devices for native-specific bugs
- Use Instruments/Profiler for performance issues
- Set up symbolication for crash reports
