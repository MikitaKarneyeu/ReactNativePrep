CodePush is a service by Microsoft (now part of App Center) that enables OTA (Over-The-Air) updates for React Native apps. It allows you to push JavaScript bundle updates directly to users' devices without going through app store review.

**How CodePush works:**

1. You build your React Native app and submit it to the app stores (with native code)
2. When you make JavaScript-only changes, you push an update via CodePush
3. The app checks for updates on launch or resume
4. If an update is available, it's downloaded in the background
5. The update is applied on the next app restart (or immediately, depending on config)

**Installation:**

```bash
npm install react-native-code-push
cd ios && pod install
```

**Setup in your app:**

```tsx
import codePush from 'react-native-code-push';

// Wrap your root component
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATELY,
};

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <MainNavigator />
    </View>
  );
};

export default codePush(codePushOptions)(App);
```

**Check and install updates manually:**

```tsx
import codePush from 'react-native-code-push';

async function checkForUpdate() {
  const update = await codePush.checkForUpdate();

  if (update) {
    if (update.isMandatory) {
      // Mandatory update - install immediately
      codePush.sync({
        installMode: codePush.InstallMode.IMMEDIATELY,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATELY,
      });
    } else {
      // Optional update - let user choose
      showUpdateDialog(update.description, () => {
        codePush.sync({
          installMode: codePush.InstallMode.ON_NEXT_RESTART,
        });
      });
    }
  }
}
```

**Deployment via CLI:**

```bash
# Install App Center CLI
npm install -g appcenter-cli

# Login
appcenter login

# Release an update
appcenter codepush release-react \
  -a YourOrg/YourApp-iOS \
  -d Production \
  -m \
  --description "Fix crash on login screen"

# Release to staging
appcenter codepush release-react \
  -a YourOrg/YourApp-iOS \
  -d Staging \
  --description "New checkout flow"

# Promote staging to production
appcenter codepush promote \
  -a YourOrg/YourApp-iOS \
  -s Staging \
  -d Production

# Rollback
appcenter codepush rollback \
  -a YourOrg/YourApp-iOS \
  -d Production
```

**Deployment configurations:**

```tsx
// Different update behaviors
const options = {
  // Check on every app resume
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,

  // Install on next restart (default)
  installMode: codePush.InstallMode.ON_NEXT_RESTART,

  // Install immediately (for mandatory updates)
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATELY,

  // Install when app goes to background
  // installMode: codePush.InstallMode.ON_NEXT_SUSPEND,

  // Minimum background duration before installing
  minimumBackgroundDuration: 60, // seconds
};
```

**Update dialog UX:**

```tsx
import codePush from 'react-native-code-push';
import { Alert } from 'react-native';

const codePushOptions = {
  updateDialog: {
    title: 'Update Available',
    mandatoryUpdateMessage: 'An important update is available. Please install it now.',
    mandatoryContinueButtonLabel: 'Install Now',
    optionalUpdateMessage: 'A new version is available. Would you like to update?',
    optionalInstallButtonLabel: 'Install',
    optionalIgnoreButtonLabel: 'Later',
  },
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATELY,
};
```

**Version compatibility:**

CodePush checks the binary version to ensure compatibility:

```bash
# Only target specific binary versions
appcenter codepush release-react \
  -a YourOrg/YourApp \
  -d Production \
  --target-binary-version "2.1.0"
```

**Best practices:**
- Test CodePush updates thoroughly in staging before production
- Use mandatory updates for critical bug fixes
- Implement proper error handling for failed updates
- Monitor update adoption and rollback rates
- Keep binary versions compatible with planned OTA updates
- Use deployment environments (Staging, Production)
- Don't push breaking changes that require native updates via CodePush
- Use `--target-binary-version` to ensure compatibility
- Implement a custom update dialog for better UX
- Consider alternatives like EAS Update (Expo) which is actively maintained
