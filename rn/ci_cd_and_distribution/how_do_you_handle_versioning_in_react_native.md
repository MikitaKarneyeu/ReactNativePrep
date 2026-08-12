Versioning in React Native involves managing the app version string (e.g., "2.1.0") and build number (e.g., "145") across the JavaScript, iOS, and Android codebases. Proper versioning ensures users get the correct updates and helps track releases.

**Version components:**

- **Version name/number** (semantic version): `Major.Minor.Patch` (e.g., "2.1.0")
  - Shown to users in the app store
  - Increment for new features (minor) or breaking changes (major)
- **Build number**: Integer that increases with each build (e.g., "145")
  - Must be unique for each build submitted to the store
  - Used to identify specific builds

**Where version is defined:**

**package.json:**
```json
{
  "version": "2.1.0"
}
```

**iOS (Info.plist or Xcode project):**
```xml
<key>CFBundleShortVersionString</key>
<string>2.1.0</string>
<key>CFBundleVersion</key>
<string>145</string>
```

**Android (build.gradle):**
```gradle
android {
  defaultConfig {
    versionCode 145
    versionName "2.1.0"
  }
}
```

**Automating version incrementing:**

**Using react-native-version:**

```bash
npm install --save-dev react-native-version
```

```json
// package.json
{
  "scripts": {
    "version": "react-native-version"
  }
}
```

```bash
# Increment patch version
npm version patch
npm run version

# Increment minor version
npm version minor
npm run version
```

**Using Fastlane:**

```ruby
# Increment build number from TestFlight
increment_build_number(
  build_number: latest_testflight_build_number + 1,
  xcodeproj: "YourApp.xcodeproj"
)

# Increment version
increment_version_number(
  version_number: "2.1.0",
  xcodeproj: "YourApp.xcodeproj"
)
```

**Using semantic release:**

```bash
npm install --save-dev semantic-release
```

```json
// .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    ["@semantic-release/git", {
      "assets": ["package.json", "CHANGELOG.md"],
      "message": "chore(release): ${nextRelease.version}"
    }]
  ]
}
```

**Git-based versioning:**

Use git tags to track releases:

```bash
# Tag a release
git tag -a v2.1.0 -m "Release 2.1.0"
git push origin v2.1.0

# Get version from git tag in CI
VERSION=$(git describe --tags --abbrev=0)
```

**Build number strategies:**

1. **Timestamp-based**: Use Unix timestamp
```bash
BUILD_NUMBER=$(date +%s)
```

2. **Git commit count**: Use total commits
```bash
BUILD_NUMBER=$(git rev-list --count HEAD)
```

3. **CI build number**: Use CI's built-in counter
```yaml
# GitHub Actions
build-number: ${{ github.run_number }}
```

4. **Manual increment**: Increment in code and commit

**EAS Build versioning:**

```json
// eas.json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

EAS Build automatically increments the build number for each build.

**Version management scripts:**

```json
// package.json
{
  "scripts": {
    "version:patch": "npm version patch && cd ios && agvtool next-version -all && cd ../android && ./gradlew bumpVersion",
    "version:minor": "npm version minor && cd ios && agvtool next-version -all && cd ../android && ./gradlew bumpVersion",
    "version:build": "cd ios && agvtool next-version -all && cd ../android && ./gradlew bumpVersionCode"
  }
}
```

**Displaying version in the app:**

```tsx
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

function AboutScreen() {
  const version = DeviceInfo.getVersion(); // "2.1.0"
  const buildNumber = DeviceInfo.getBuildNumber(); // "145"

  return (
    <View>
      <Text>Version: {version} ({buildNumber})</Text>
    </View>
  );
}
```

**Best practices:**
- Use semantic versioning (Major.Minor.Patch)
- Auto-increment build numbers in CI
- Keep version in sync across package.json, iOS, and Android
- Tag releases in git
- Display version in the app for debugging
- Use build numbers that always increase (not semantic version)
- Automate version bumping in your release process
- Document your versioning strategy for the team
