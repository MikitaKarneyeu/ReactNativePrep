React Native build errors can be frustrating because they span JavaScript, native iOS (Xcode), and native Android (Gradle) layers. Here are the most common errors and their solutions.

**1. Metro bundler issues:**

**Error: "Unable to resolve module"**
```
Unable to resolve module `xxx` from `yyy`
```
Solution:
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Or
watchman watch-del-all && rm -rf node_modules && npm install
```

**Error: "Invariant Violation: Module AppRegistry is not a registered callable module"**
Solution:
```bash
# Clear cache and reinstall
rm -rf node_modules && npm install
cd ios && pod install && cd ..
```

**2. iOS build errors:**

**Error: "No bundle URL present"**
Solution:
```bash
# Clean build folder
cd ios && xcodebuild clean && cd ..
# Reinstall pods
cd ios && pod install && cd ..
# Make sure Metro is running
npx react-native start
```

**Error: "Pod install failed"**
```bash
# Update CocoaPods
cd ios && pod install --repo-update
# Or reset pods
cd ios && rm -rf Pods && pod install
```

**Error: "No matching function for call to 'RCTBridgeModuleForClass'"**
Solution: Update React Native pods:
```bash
cd ios && pod update React-Core && pod install
```

**Error: "Undefined symbol" during build**
Solution: Usually a linking issue:
- Check Build Phases → Link Binary With Libraries
- Ensure all native modules are properly linked
- Run `cd ios && pod install`

**3. Android build errors:**

**Error: "Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'"**
```bash
cd android && ./gradlew clean && cd ..
# Then rebuild
```

**Error: "Execution failed for task ':app:mergeDebugNativeLibs'"**
Solution: Clean Gradle build:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

**Error: "SDK location not found"**
Create or update `android/local.properties`:
```
sdk.dir=/Users/yourname/Library/Android/sdk
```

**Error: "java.lang.OutOfMemoryError"**
In `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
```

**Error: "Could not find tools.jar"**
Ensure JAVA_HOME is set correctly:
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
```

**4. Dependency issues:**

**Error: "Invariant Violation: requireNativeComponent: 'xxx' was not found in the UIManager"**
Solution: The native module isn't linked:
```bash
# Autolinking
cd ios && pod install && cd ..
# Manual linking (older RN)
npx react-native link xxx
```

**Error: "Multiple commands produce..."**
Conflicting build phases:
```bash
cd ios && pod install
# Check for duplicate entries in Podfile
```

**5. TypeScript errors:**

**Error: "Type 'xxx' is not assignable to type 'yyy'"**
```bash
# Check tsconfig.json
npx tsc --noEmit
```

**6. Code signing errors (iOS):**

**Error: "Signing requires a development team"**
- Open Xcode, select your project
- Set your Development Team in Signing & Capabilities
- Ensure your Bundle Identifier is unique

**Error: "No profiles found"**
```bash
# Regenerate provisioning profiles
fastlane match development
```

**7. General troubleshooting steps:**

```bash
# Nuclear option - clean everything
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf android/app/build
rm -rf android/.gradle
npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache
```

**8. Environment issues:**

```bash
# Check your environment
npx react-native doctor

# This checks:
# - Node.js version
# - npm/yarn
# - Watchman
# - Xcode
# - CocoaPods
# - JDK
# - Android SDK
# - ANDROID_HOME
```

**Best practices:**
- Run `npx react-native doctor` after environment changes
- Keep dependencies updated regularly
- Use `.nvmrc` to lock Node.js version
- Document platform-specific setup requirements
- Use CI to catch build issues early
- Commit `Podfile.lock` and `yarn.lock`/`package-lock.json`
