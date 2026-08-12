Publishing React Native apps to the App Store and Google Play involves building signed binaries, creating store listings, and submitting for review. Here are the steps for each platform.

**iOS App Store:**

**1. Prerequisites:**
- Apple Developer Account ($99/year)
- App ID registered in Apple Developer Portal
- Distribution certificate and provisioning profile
- App Store Connect entry

**2. Build the app:**

```bash
# Using Xcode
xcodebuild -workspace ios/YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -archivePath build/YourApp.xcarchive \
  archive

# Using Fastlane
cd ios && fastlane beta  # or fastlane release

# Using EAS Build
eas build --platform ios --profile production
```

**3. Upload to App Store Connect:**

```bash
# Using Xcode
# Window → Organizer → Distribute App → App Store Connect

# Using Fastlane
upload_to_testflight  # For testing
upload_to_app_store   # For release

# Using EAS
eas submit --platform ios
```

**4. Configure App Store Connect:**
- App name, subtitle, description
- Screenshots for all required device sizes
- App icon
- Keywords, categories, age rating
- Privacy policy URL
- App review information (demo account if needed)
- Pricing and availability

**5. Submit for review:**
- Click "Submit for Review" in App Store Connect
- Apple reviews typically take 24-48 hours
- Address any review feedback

**Google Play Store:**

**1. Prerequisites:**
- Google Play Developer Account ($25 one-time fee)
- App signing configured (Google Play App Signing recommended)
- AAB (Android App Bundle) format

**2. Build the app:**

```bash
# Using Gradle
cd android && ./gradlew bundleRelease

# Using Fastlane
cd android && fastlane beta

# Using EAS Build
eas build --platform android --profile production
```

**3. Create Play Store listing:**
- Google Play Console → All apps → Create app
- App name, description, short description
- Screenshots (phone, tablet, TV if applicable)
- Feature graphic
- App icon
- Content rating questionnaire
- Privacy policy
- Data safety form

**4. Upload the AAB:**

```bash
# Using Fastlane
upload_to_play_store(
  track: "internal",
  aab: "app/build/outputs/bundle/release/app-release.aab",
  json_key: "play-store-credentials.json",
  package_name: "com.yourapp"
)

# Using EAS
eas submit --platform android
```

**5. Release tracks:**
- **Internal testing**: Up to 100 testers, no review
- **Closed testing (Alpha/Beta)**: Up to specific groups
- **Open testing**: Public beta, opt-in
- **Production**: All users

**6. Promote through tracks:**
```bash
# Promote internal to production
upload_to_play_store(
  track: "internal",
  track_promote_to: "production",
  skip_upload_aab: true
)
```

**Shared steps for both platforms:**

```bash
# 1. Version bump
# Update version in package.json and native configs

# 2. Build
eas build --platform all --profile production

# 3. Test the build
# Install on device, run through critical flows

# 4. Submit
eas submit --platform all

# 5. Monitor
# Watch for review feedback, crash reports, user reviews
```

**Release checklist:**
- [ ] Version number incremented
- [ ] Build number incremented
- [ ] All tests passing
- [ ] Crash reporting configured
- [ ] Analytics configured
- [ ] Store listing complete (description, screenshots, etc.)
- [ ] Privacy policy published
- [ ] App reviewed for compliance (content rating, data safety)
- [ ] Demo account provided for reviewers (if needed)
- [ ] Release notes written
- [ ] Phased rollout configured (if desired)
- [ ] Monitoring dashboard ready

**Phased releases:**
- iOS: Automatic phased release (1% → 5% → 10% → ... → 100%)
- Android: Staged rollout percentage

**Best practices:**
- Test thoroughly on real devices before submitting
- Use TestFlight (iOS) and Internal Testing (Android) before production
- Write clear release notes
- Start with a small percentage for phased rollout
- Monitor crash rates and reviews after release
- Have a rollback plan (CodePush for JS, new release for native)
