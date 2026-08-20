Fabric is React Native's new rendering system that replaces the old UI Manager. It's a core component of the New Architecture that fundamentally changes how React Native renders UI by using JSI for synchronous, direct communication between JavaScript and native rendering code.

**How the old rendering system worked:**

1. React reconciles the virtual DOM and produces a tree of mutations
2. These mutations are serialized to JSON and sent over the bridge
3. The native UI Manager receives the batch and applies mutations to native views
4. Layout is computed asynchronously on a shadow thread
5. Results are sent back over the bridge

This asynchronous, serialized pipeline introduced latency and prevented JS from reading layout information synchronously.

**How Fabric works:**

1. React reconciles and produces mutations (same as before)
2. Mutations are applied directly to C++ shadow tree objects via JSI (no serialization)
3. Layout computation happens in C++ (using Yoga) on any thread
4. JS can read layout results synchronously through JSI
5. Native view updates are batched and applied on the UI thread

**Key benefits:**

**1. Synchronous rendering**: Fabric allows JavaScript to read layout information (like element dimensions and positions) synchronously. This was impossible with the old architecture—any layout read required an async callback.

```tsx
// Fabric enables synchronous layout reads
const ref = useRef();
const layout = ref.current?.getLayout();
// Returns { x, y, width, height } immediately
```

**2. Concurrent rendering support**: Fabric integrates with React 18's concurrent features:
- **Suspense**: Show fallbacks while data loads
- **Transitions**: Mark updates as non-urgent to keep the UI responsive
- **useDeferredValue**: Defer expensive re-renders

```tsx
function SearchScreen() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} />
      <SearchResults query={deferredQuery} />
    </View>
  );
}
```

**3. Simpler threading model**: In the old architecture, rendering had to happen on specific threads. Fabric allows rendering work to happen on any thread, giving the system more flexibility to schedule work optimally.

**4. Improved list performance**: Fabric enables synchronous measurement of list items before rendering, leading to fewer layout jumps and better FlatList performance.

**5. Better integration with React**: Fabric's C++ shadow tree aligns with React's internal data structures, making the rendering pipeline more efficient and enabling features that weren't possible before.

**6. Reduced memory usage**: Shared C++ shadow tree objects between JS and native reduce memory duplication.

**How it affects day-to-day development:**

For most developers, Fabric works transparently—your existing React code continues to work. The benefits are primarily:
- Smoother animations and transitions
- Better scroll performance in complex lists
- Ability to use React 18 concurrent features
- More responsive UI under heavy JS load

Fabric is enabled by default in React Native 0.76+ and works in conjunction with JSI and the Hermes engine for optimal performance.
