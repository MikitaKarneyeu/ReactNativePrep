Setting up CI/CD for React Native automates building, testing, and distributing your app. The pipeline typically includes linting, testing, building native binaries, and deploying to app stores or testers.

**Common CI/CD platforms:**
- GitHub Actions
- Bitrise
- EAS Build (Expo)
- CircleCI
- Codemagic

**Example: GitHub Actions workflow:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - run: npm ci
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: android-release
          path: android/app/build/outputs/apk/release/app-release.apk

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm ci
      - run: cd ios && pod install
      - run: |
          xcodebuild -workspace ios/YourApp.xcworkspace \
            -scheme YourApp \
            -configuration Release \
            -archivePath build/YourApp.xcarchive \
            archive
      - uses: actions/upload-artifact@v4
        with:
          name: ios-release
          path: build/YourApp.xcarchive
```

**Key CI/CD steps:**

1. **Install dependencies**: `npm ci` (clean install)
2. **Lint**: `npm run lint` (ESLint)
3. **Type check**: `npm run typecheck` (TypeScript)
4. **Unit tests**: `npm test`
5. **E2E tests**: Detox or Maestro (optional, slower)
6. **Build Android**: `./gradlew assembleRelease`
7. **Build iOS**: `xcodebuild archive`
8. **Code signing**: Fastlane or EAS Build handles this
9. **Deploy**: Upload to TestFlight, Google Play, or Firebase App Distribution

**Using Fastlane for builds:**

```ruby
# fastlane/Fastfile
platform :android do
  lane :beta do
    gradle(task: 'clean assembleRelease')
    upload_to_play_store(track: 'internal')
  end
end

platform :ios do
  lane :beta do
    build_app(scheme: 'YourApp')
    upload_to_testflight
  end
end
```

**Using EAS Build (Expo):**

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@apple.id",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json"
      }
    }
  }
}
```

```bash
# Build
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

**Best practices:**
- Run tests on every pull request
- Cache `node_modules` and native build artifacts
- Use separate signing keys for development and production
- Run builds in parallel for iOS and Android
- Set up notifications for build failures
- Use environment variables for secrets (API keys, signing certificates)
- Keep CI configuration in version control
- Run E2E tests on a schedule (nightly) rather than every commit
- Use `npm ci` instead of `npm install` for deterministic builds
