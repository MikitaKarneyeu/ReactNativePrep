`navigate` and `push` are both methods for moving to a new screen, but they behave differently when the target screen already exists in the navigation stack.

**`navigation.navigate('ScreenName', params)`**:
- If the screen is already in the stack, it navigates to the existing instance (moves it to the top)
- If the screen is not in the stack, it pushes a new instance
- This prevents duplicate screens in the stack
- Uses the existing screen's state if navigating to an existing instance

```tsx
// If Profile is already in the stack, navigate to it
// If not, push it
navigation.navigate('Profile', { userId: '123' });
```

**`navigation.push('ScreenName', params)`**:
- Always pushes a new instance of the screen onto the stack
- Allows multiple instances of the same screen
- Each pushed instance maintains its own state independently

```tsx
// Always pushes a new Profile screen, even if one exists
navigation.push('Profile', { userId: '456' });
navigation.push('Profile', { userId: '789' });
// Stack: Home → Profile(123) → Profile(456) → Profile(789)
```

**Practical example:**

Imagine a user list where tapping a user opens their profile, and within a profile you can view another user's profile:

```tsx
function UserListScreen({ navigation }) {
  return (
    <UserList
      onUserPress={(userId) =>
        navigation.push('Profile', { userId })
      }
    />
  );
}

function ProfileScreen({ navigation, route }) {
  const { userId } = route.params;
  return (
    <View>
      <UserProfile userId={userId} />
      <Button
        title="View Friend"
        onPress={() => navigation.push('Profile', { userId: friendId })}
      />
    </View>
  );
}
```

Using `push` here allows the user to drill deeper into profiles and then use the back button to return through each profile. Using `navigate` would replace the current profile instead of stacking a new one.

**When to use each:**

| Use `navigate` when | Use `push` when |
|---|---|
| Moving between distinct sections | Drilling into detail views |
| You want to avoid duplicates | Multiple instances are meaningful |
| Tab switching | Breadcrumb-style navigation |
| Going to a unique screen | Same screen type with different data |

**Other navigation methods:**
- `navigation.goBack()`: Returns to the previous screen
- `navigation.pop(n)`: Pops n screens off the stack
- `navigation.popToTop()`: Returns to the first screen in the stack
- `navigation.replace('Screen')`: Replaces current screen (no back button)
- `navigation.reset({ routes })`: Resets the entire navigation state
