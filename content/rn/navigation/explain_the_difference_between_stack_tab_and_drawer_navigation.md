React Navigation provides three primary navigator types, each implementing a different navigation pattern. Understanding when to use each is fundamental to structuring a React Native app.

**Stack Navigator** manages a stack of screens where each new screen is pushed on top and you navigate back by popping it off. It provides platform-native transitions—on iOS, screens slide in from the right; on Android, they use a material design transition. Stack navigation is the most common pattern and is used for linear flows like Home → Details → Settings.

```tsx
const Stack = createNativeStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>
```

**Tab Navigator** displays a tab bar (typically at the bottom) allowing users to switch between screens. Each tab maintains its own navigation state independently—switching tabs doesn't reset the screen within that tab. Use tabs for primary app sections that users access frequently, like Home, Search, and Profile.

```tsx
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Feed" component={FeedScreen} />
  <Tab.Screen name="Search" component={SearchScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

**Drawer Navigator** slides a panel in from the side of the screen (left by default). It's used for secondary navigation, app-wide settings, or when you have many top-level destinations that don't fit in a tab bar. Users can swipe from the edge or tap a hamburger menu to open it.

```tsx
const Drawer = createDrawerNavigator();

<Drawer.Navigator>
  <Drawer.Screen name="Home" component={HomeScreen} />
  <Drawer.Screen name="Settings" component={SettingsScreen} />
</Drawer.Navigator>
```

**Key differences:**

| Feature | Stack | Tab | Drawer |
|---|---|---|---|
| Navigation style | Push/pop linear | Parallel switching | Side panel |
| State preservation | Each screen has own history | Each tab maintains own stack | Each item maintains own history |
| Transitions | Platform-native push | Instant tab switch | Slide from edge |
| Common use | Detail flows, forms | Primary app sections | Secondary navigation, settings |

**Nesting navigators**: In practice, apps combine these. A common pattern is a Tab navigator as the root, with each tab containing its own Stack navigator:

```tsx
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

<Tab.Navigator>
  <Tab.Screen name="HomeTab" component={HomeStack} />
  <Tab.Screen name="ProfileTab" component={ProfileScreen} />
</Tab.Navigator>
```

This nesting allows each tab to have its own independent back stack while sharing the bottom tab bar.
