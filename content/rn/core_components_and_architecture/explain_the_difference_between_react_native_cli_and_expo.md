React Native CLI and Expo are two approaches to building React Native apps, each with different tradeoffs in terms of flexibility, complexity, and development experience.

**React Native CLI** is the official, lower-level approach:

- **Setup**: You initialize with `npx react-native init MyApp` and get a bare project with `ios/` and `android/` directories containing native code.
- **Native Access**: You have full access to native project files. You can modify `AppDelegate.swift`, `build.gradle`, and any native configuration directly.
- **Native Modules**: You can install any native module, write custom native code in Swift/Kotlin/Objective-C, and link native libraries manually or via autolinking.
- **Build Tools**: You manage Xcode, Android Studio, Gradle, and CocoaPods directly. Builds happen locally or on your own CI.
- **Tradeoffs**: More complex setup, requires macOS for iOS development, manual dependency management, and deeper knowledge of native tooling.

**Expo** is a higher-level framework built on top of React Native:

- **Setup**: You initialize with `npx create-expo-app MyApp` and get a managed project without `ios/` or `android/` directories by default.
- **Managed Workflow**: Expo provides a curated set of native modules through `expo-*` packages (camera, location, notifications, etc.). You don't write native code directly.
- **Expo Go**: You can test your app instantly in the Expo Go app without building native binaries. This dramatically speeds up development.
- **EAS Build**: Expo Application Services handles cloud builds, OTA updates (via EAS Update), and app store submissions without needing Xcode or Android Studio locally.
- **Continuous Native Generation**: Expo can generate native directories on demand using `npx expo prebuild`, giving you access to native code when needed while keeping it regenerable.

**Key differences:**

| Aspect | React Native CLI | Expo |
|---|---|---|
| Native code access | Full | Via prebuild or config plugins |
| Setup complexity | Higher | Lower |
| Build process | Local | Cloud (EAS) or local |
| OTA updates | Manual (CodePush) | Built-in (EAS Update) |
| Native modules | Any | Curated set + config plugins |
| Development speed | Slower setup | Faster with Expo Go |

**When to choose which:**
- Use **Expo** for most new projects—it handles the majority of use cases, has better DX, and you can always eject or use config plugins for native customization.
- Use **React Native CLI** when you need deep native customization, have existing native code to integrate, or work on apps with complex native requirements that Expo doesn't support.

As of 2024+, Expo is the recommended approach for most React Native projects.
