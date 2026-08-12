EAS Build (Expo Application Services Build) is Expo's cloud build service for React Native apps. It builds native iOS and Android binaries in the cloud, handling code signing, dependency installation, and build configuration without requiring Xcode or Android Studio locally.

**How EAS Build works:**

1. You configure your build in `eas.json`
2. Run `eas build` from your terminal
3. Your source code is uploaded to Expo's cloud servers
4. The build runs in a clean cloud environment
5. You receive a download link or the build is submitted directly to app stores

**Installation and setup:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project
eas build:configure
```

**eas.json configuration:**

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@apple.id",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "internal"
      }
    }
  }
}
```

**Building:**

```bash
# Build for both platforms
eas build --platform all --profile production

# Build for iOS only
eas build --platform ios --profile production

# Build for Android only
eas build --platform android --profile production

# Build for development (dev client)
eas build --platform ios --profile development

# Local build (runs on your machine)
eas build --platform ios --profile production --local
```

**Code signing with EAS Build:**

EAS Build handles code signing automatically:

**iOS:**
- EAS manages certificates and provisioning profiles
- You can use your own or let EAS generate them
- Credentials are stored securely in Expo's cloud

```bash
# Manage credentials
eas credentials

# Use existing credentials or generate new ones
# EAS prompts you during the first build
```

**Android:**
- EAS manages the keystore
- You can upload your own or let EAS generate one
- Keystore is stored securely

**Submitting to stores:**

```bash
# Submit to App Store and Google Play
eas submit --platform all --profile production

# Submit iOS only
eas submit --platform ios

# Submit Android only
eas submit --platform android
```

**Build profiles explained:**

- **development**: Creates a development client (includes dev tools, requires dev server)
- **preview**: Creates a release-like build for testing (distributed internally)
- **production**: Creates the production build for app store submission

**EAS Update (OTA):**

```bash
# Publish an OTA update
eas update --channel production --message "Fix login bug"

# Branch-based updates
eas update --branch main
```

**Environment variables:**

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.production.com"
      }
    },
    "preview": {
      "env": {
        "API_URL": "https://api.staging.com"
      }
    }
  }
}
```

**Build caching:**

EAS Build caches dependencies and native build artifacts:

```json
{
  "build": {
    "production": {
      "cache": {
        "key": "custom-cache-key-v1"
      }
    }
  }
}
```

**Pricing:**
- Free tier: Limited builds per month
- Paid plans: More builds, priority queue, larger workers
- Pay-as-you-go option available

**When to use EAS Build:**
- You don't want to manage Xcode/Android Studio locally
- You need consistent build environments
- You want automatic code signing management
- You're using Expo or Expo modules
- You want integrated OTA updates
- Your team needs a shared build infrastructure

**When EAS Build might not be ideal:**
- You need full control over the build environment
- You have complex native dependencies that require custom build steps
- You need to build offline
- Budget constraints (free tier limits)

**Best practices:**
- Use build profiles for different environments
- Enable auto-increment for build numbers
- Use channels for OTA update targeting
- Store environment variables in EAS, not in code
- Use `--local` for debugging build issues
- Set up GitHub integration for automatic builds on push
- Use EAS Update for JS-only changes, full builds for native changes
