Shared element transitions animate an element from one screen to another during navigation, creating a visual connection between screens. In React Native, this is typically implemented using `react-native-shared-element` with React Navigation.

**Using react-native-shared-element:**

```bash
npm install react-native-shared-element react-navigation-shared-element
```

**Setup with React Navigation:**

```tsx
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          sharedElements={(route) => {
            const { item } = route.params;
            return [
              {
                id: `item.${item.id}.image`,
                animation: 'move',
                resize: 'clip',
                align: 'left-top',
              },
              {
                id: `item.${item.id}.title`,
                animation: 'fade',
                resize: 'clip',
              },
            ];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**List screen with shared elements:**

```tsx
import { SharedElement } from 'react-navigation-shared-element';

function ListScreen({ navigation }) {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('Detail', { item })}>
          <View style={styles.card}>
            <SharedElement id={`item.${item.id}.image`}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </SharedElement>
            <SharedElement id={`item.${item.id}.title`}>
              <Text style={styles.title}>{item.title}</Text>
            </SharedElement>
          </View>
        </Pressable>
      )}
    />
  );
}
```

**Detail screen:**

```tsx
function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={styles.detail}>
      <SharedElement id={`item.${item.id}.image`}>
        <Image source={{ uri: item.image }} style={styles.detailImage} />
      </SharedElement>
      <SharedElement id={`item.${item.id}.title`}>
        <Text style={styles.detailTitle}>{item.title}</Text>
      </SharedElement>
      <Text>{item.description}</Text>
    </View>
  );
}
```

**Transition configuration:**

```tsx
<Stack.Screen
  name="Detail"
  component={DetailScreen}
  sharedElements={(route) => [...]}
  options={{
    gestureEnabled: false,
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 300 } },
      close: { animation: 'timing', config: { duration: 300 } },
    },
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: { opacity: progress },
    }),
  }}
/>
```

**Alternative approach with Reanimated (manual):**

For more control, you can implement shared element transitions manually using Reanimated and layout measurements:

```tsx
function ManualSharedElement({ item, onPress }) {
  const layout = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const ref = useRef();

  const measure = useCallback(async () => {
    const measurements = await new Promise((resolve) => {
      ref.current.measureInWindow((x, y, width, height) => {
        resolve({ x, y, width, height });
      });
    });
    layout.value = measurements;
  }, []);

  return (
    <Pressable
      ref={ref}
      onPress={() => {
        measure();
        onPress(item, layout.value);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
    </Pressable>
  );
}
```

**Using Moti (simpler alternative):**

```tsx
import { MotiView } from 'moti';

function AnimatedCard({ item, index }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }}
    >
      <Card item={item} />
    </MotiView>
  );
}
```

**Best practices:**
- Use consistent `SharedElement` IDs between screens (usually based on item ID)
- Match the element dimensions and aspect ratios between screens for smooth transitions
- Use `animation: 'move'` for images and `animation: 'fade'` for text
- Test transitions on slower devices to ensure smoothness
- Keep transition duration reasonable (200-400ms)
- Disable gesture during shared element transitions if they conflict
- Handle the case where images haven't loaded yet (show placeholder)
