App signing and provisioning profiles are iOS and Android mechanisms that verify the identity of your app and authorize it to run on devices and be distributed through app stores.

**iOS Code Signing:**

iOS requires every app to be signed with a development certificate and provisioning profile.

**Certificates:**
- **Development**: For running on devices during development
- **Distribution (App Store)**: For submitting to the App Store
- **Ad Hoc**: For distributing to specific test devices
- **Enterprise**: For internal distribution (requires Enterprise account)

**Provisioning profiles** link your app ID, certificate, and device list:

```ruby
# Using Fastlane Match (recommended)
# Match stores certificates and profiles in a private Git repo

# ios/fastlane/Matchfile
git_url("https://github.com/yourorg/certificates")
storage_mode("git")
type("appstore") # or "development", "adhoc"
app_identifier("com.yourapp")
```

```bash
# Generate certificates and profiles
fastlane match development
fastlane match appstore

# Read-only mode for CI
fastlane match appstore --readonly
```

**Manual setup:**

1. Create an App ID in Apple Developer Portal
2. Create certificates (Development, Distribution)
3. Register test devices (for development/adhoc)
4. Create provisioning profiles linking the above
5. Download and install certificates and profiles

**Xcode automatic signing:**

For development, Xcode can manage signing automatically:
- Enable "Automatically manage signing" in Xcode
- Select your team
- Xcode creates development certificates and profiles

**Android App Signing:**

Android uses a keystore to sign APKs/AABs.

**Keystore types:**
- **Upload key**: Used to sign the app before uploading to Google Play
- **App signing key**: Managed by Google Play (recommended) or self-managed

**Google Play App Signing (recommended):**

```bash
# Generate an upload keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore upload-keystore.p12 \
  -alias upload \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

```gradle
// android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('upload-keystore.p12')
      storePassword System.getenv("KEYSTORE_PASSWORD")
      keyAlias 'upload'
      keyPassword System.getenv("KEY_PASSWORD")
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

**Using Fastlane for signing:**

```ruby
# iOS - using Match
match(type: "appstore", readonly: true)

# Android - using supply
upload_to_play_store(
  track: "internal",
  json_key: "play-store-credentials.json",
  aab: "app/build/outputs/bundle/release/app-release.aab"
)
```

**Storing signing credentials securely:**

```yaml
# GitHub Actions - use secrets
env:
  KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
  KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
  KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}

# Decode keystore from base64
- run: echo $KEYSTORE_BASE64 | base64 --decode > android/app/keystore.p12
```

**EAS Build (Expo) handles signing automatically:**

```json
// eas.json
{
  "build": {
    "production": {
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": true
      }
    }
  }
}
```

EAS Build manages certificates, provisioning profiles, and keystores for you.

**Best practices:**
- Use Fastlane Match for iOS code signing—avoids certificate management headaches
- Use Google Play App Signing—Google manages the app signing key
- Never commit signing credentials to version control
- Store credentials in CI secrets or secure vaults
- Use separate signing configurations for development, staging, and production
- Rotate certificates before they expire
- Keep backup copies of your keystore (Android)—losing it means you can't update your app
- Use EAS Build if you want to avoid managing signing manually
- Document your signing setup for team members
