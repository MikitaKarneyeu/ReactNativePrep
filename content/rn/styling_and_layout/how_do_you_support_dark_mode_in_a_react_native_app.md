Supporting dark mode in React Native involves detecting the system color scheme, defining a color palette for both themes, and applying the correct colors throughout your app.

**1. Detect system color scheme:**

```tsx
import { useColorScheme } from 'react-native';

function App() {
  const colorScheme = useColorScheme(); // 'light', 'dark', or null
  return <MainNavigator theme={colorScheme} />;
}
```

**2. Define a color palette:**

```tsx
const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#007AFF',
  border: '#E0E0E0',
  card: '#FFFFFF',
  error: '#FF3B30',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#999999',
  primary: '#0A84FF',
  border: '#38383A',
  card: '#1C1C1E',
  error: '#FF453A',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
};
```

**3. Create a theme context:**

```tsx
const ThemeContext = createContext({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  const theme = {
    colors: isDark ? darkColors : lightColors,
    isDark,
    toggleTheme: () => setIsDark((prev) => !prev),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**4. Use theme in components:**

```tsx
function ThemedCard({ title, subtitle }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}
```

**5. Create a themed StyleSheet helper:**

```tsx
function useThemedStyles(styleFn) {
  const theme = useTheme();
  return useMemo(() => styleFn(theme), [theme]);
}

function MyComponent() {
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      title: {
        fontSize: 24,
        color: theme.colors.text,
      },
    })
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}
```

**6. Handle navigation theming:**

```tsx
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

function App() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**7. Status bar adaptation:**

```tsx
import { StatusBar } from 'react-native';

function App() {
  const isDark = useColorScheme() === 'dark';
  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}
```

**Best practices:**
- Define all colors in a central palette, never hardcode colors in components
- Support both system theme and manual override
- Use semantic color names (`text`, `background`, `primary`) not literal names (`blue`, `white`)
- Test both themes thoroughly—dark mode often reveals contrast issues
- Consider providing a toggle for users who want to override the system setting
- Use React Navigation's built-in theming for consistent navigation appearance
- Handle images that may need different versions for light/dark backgrounds
