Fastlane is an open-source automation tool that simplifies building, signing, and distributing mobile apps. It handles code signing, building, and uploading to app stores for both iOS and Android.

**Installation:**

```bash
# Install Fastlane
gem install fastlane
# or
brew install fastlane

# Initialize in your project
cd ios && fastlane init
cd android && fastlane init
```

**Key Fastlane concepts:**

- **Lanes**: Named sequences of actions (like "beta", "release", "test")
- **Actions**: Individual steps (build, sign, upload, screenshot)
- **Match**: Code signing management (stores certificates in a Git repo)

**iOS Fastfile:**

```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Run tests"
  lane :test do
    run_tests(scheme: "YourApp")
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    # Sync code signing
    match(type: "appstore", readonly: true)

    # Increment build number
    increment_build_number(
      build_number: latest_testflight_build_number + 1,
      xcodeproj: "YourApp.xcodeproj"
    )

    # Build the app
    build_app(
      workspace: "YourApp.xcworkspace",
      scheme: "YourApp",
      configuration: "Release",
      export_method: "app-store"
    )

    # Upload to TestFlight
    upload_to_testflight(skip_waiting_for_build_processing: true)
  end

  desc "Build and upload to App Store"
  lane :release do
    match(type: "appstore", readonly: true)

    build_app(
      workspace: "YourApp.xcworkspace",
      scheme: "YourApp",
      configuration: "Release",
      export_method: "app-store"
    )

    upload_to_app_store(
      skip_metadata: true,
      skip_screenshots: true,
      submit_for_review: false
    )
  end
end
```

**Android Fastfile:**

```ruby
# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Build and upload to Google Play internal track"
  lane :beta do
    gradle(task: "clean assembleRelease")

    upload_to_play_store(
      track: "internal",
      aab: "app/build/outputs/bundle/release/app-release.aab",
      json_key: "play-store-credentials.json",
      package_name: "com.yourapp"
    )
  end

  desc "Promote internal to production"
  lane :release do
    upload_to_play_store(
      track: "internal",
      track_promote_to: "production",
      skip_upload_apk: true,
      skip_upload_aab: true,
      skip_upload_metadata: true,
      json_key: "play-store-credentials.json",
      package_name: "com.yourapp"
    )
  end
end
```

**Code signing with Match:**

Match stores certificates and provisioning profiles in a private Git repo:

```ruby
# Generate new certificates
match(type: "development")
match(type: "appstore")

# Use in lanes
match(type: "appstore", readonly: true) # Read-only in CI
```

**Matchfile:**

```ruby
# ios/fastlane/Matchfile
git_url("https://github.com/yourorg/certificates")
storage_mode("git")
type("appstore")
app_identifier("com.yourapp")
```

**Running Fastlane:**

```bash
# iOS
cd ios && fastlane beta
cd ios && fastlane release

# Android
cd android && fastlane beta
cd android && fastlane release

# From project root
bundle exec fastlane ios beta
bundle exec fastlane android beta
```

**Integration with React Native:**

```ruby
# Before building, install dependencies
lane :beta do
  # Install JS dependencies
  sh("cd .. && npm ci")

  # iOS: install pods
  sh("cd ios && pod install")

  # Build
  build_app(...)
end
```

**Fastlane with GitHub Actions:**

```yaml
- name: Build and deploy iOS
  env:
    FASTLANE_USER: ${{ secrets.FASTLANE_USER }}
    FASTLANE_PASSWORD: ${{ secrets.FASTLANE_PASSWORD }}
    MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
    MATCH_GIT_PRIVATE_KEY: ${{ secrets.MATCH_GIT_PRIVATE_KEY }}
  run: |
    cd ios
    bundle exec fastlane beta
```

**Best practices:**
- Use `match` for code signing—it's the most reliable approach
- Store Fastlane configuration in version control
- Use `readonly: true` in CI to prevent accidental certificate changes
- Increment build numbers automatically
- Store sensitive values in environment variables or CI secrets
- Use separate lanes for different environments (dev, staging, production)
- Test your Fastfile locally before running in CI
- Keep Fastlane updated (`gem update fastlane`)
