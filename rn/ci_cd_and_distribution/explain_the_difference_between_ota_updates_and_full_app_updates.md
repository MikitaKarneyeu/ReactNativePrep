OTA (Over-The-Air) updates and full app updates are two different mechanisms for delivering changes to your React Native app. They differ in what they can update, how they're delivered, and their review process.

**OTA Updates:**

OTA updates deliver JavaScript bundle changes directly to users' devices without going through the app store review process. They update only the JavaScript code and assets, not native code.

```
What OTA updates can change:
✅ JavaScript business logic
✅ React component rendering
✅ Styles and layouts
✅ Images and assets
✅ Text content and translations

What OTA updates CANNOT change:
❌ Native module code (Swift/Kotlin)
❌ Native dependencies
❌ App permissions
❌ App icons or splash screens
❌ Native configuration
❌ Plugin versions
```

**Full App Updates:**

Full app updates deliver a complete new version of the app through the App Store or Google Play. They can change everything, including native code.

```
What full updates can change:
✅ Everything OTA can change
✅ Native code
✅ New native modules
✅ App permissions
✅ App icons and splash screens
✅ Native configuration
✅ Minimum OS version
```

**OTA with EAS Update (Expo):**

```bash
# Publish an OTA update
eas update --channel production --message "Fix login bug"

# Branch-based updates
eas update --branch main --message "New feature"
```

```json
// eas.json
{
  "build": {
    "production": {
      "channel": "production"
    }
  }
}
```

**OTA with CodePush (Microsoft):**

```bash
# Release an update
appcenter codepush release-react -a YourOrg/YourApp -d Production -m --description "Bug fix"
```

```tsx
import codePush from 'react-native-code-push';

// Wrap your app
const App = codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
})(RootComponent);
```

**When to use OTA updates:**
- Bug fixes in JavaScript code
- UI/text changes
- Feature flags and A/B tests
- Emergency fixes (skip app review wait time)
- Content updates
- Performance optimizations in JS layer

**When to use full app updates:**
- New native module dependencies
- Changes to native code
- New permissions required
- App icon or splash screen changes
- Minimum OS version changes
- Major architectural changes
- Changes that require new native APIs

**Versioning strategy:**

```
App Version: 2.1.0 (native version - changes with full update)
JS Bundle Version: 2.1.0-bundle.3 (OTA version - increments with each OTA)
```

**Compatibility checking:**

OTA updates must be compatible with the native version:

```tsx
// In your OTA update service
// Only deliver OTA updates to compatible native versions
{
  "targetAppVersion": ">=2.0.0",
  "minAppVersion": "2.0.0",
  "bundleVersion": "2.1.0-bundle.3"
}
```

**Rollback capability:**

OTA services allow instant rollback if an update causes issues:

```bash
# Rollback to previous version
eas update --channel production --rollback
```

**Best practices:**
- Use OTA for JS-only changes to speed up delivery
- Always test OTA updates thoroughly before releasing
- Implement compatibility checks between OTA and native versions
- Use phased rollouts for OTA updates (10% → 50% → 100%)
- Have a rollback strategy ready
- Monitor crash rates after OTA updates
- Use code signing for OTA bundles to prevent tampering
- Keep native versions compatible with planned OTA updates
- Document which changes require full updates vs OTA
