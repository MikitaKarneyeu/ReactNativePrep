Image optimization is critical for React Native performance because images are often the largest assets in an app, consuming significant memory and bandwidth. Proper optimization improves load times, scrolling performance, and memory usage.

**1. Resize images to display dimensions:**

Don't load a 2000x2000 image if it's displayed at 100x100. Resize server-side or use query parameters:

```tsx
// Bad - loads full resolution
<Image source={{ uri: 'https://example.com/photo.jpg' }} style={{ width: 100, height: 100 }} />

// Good - request appropriately sized image
<Image source={{ uri: 'https://example.com/photo.jpg?w=200&h=200' }} style={{ width: 100, height: 100 }} />
```

**2. Use react-native-fast-image for caching and performance:**

```tsx
import FastImage from 'react-native-fast-image';

<FastImage
  style={{ width: 100, height: 100 }}
  source={{
    uri: 'https://example.com/photo.jpg',
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

FastImage uses SDWebImage (iOS) and Glide (Android) under the hood, providing:
- Aggressive disk and memory caching
- Progressive loading
- Better memory management
- Priority-based loading

**3. Use appropriate resizeMode:**

```tsx
// cover: Fills the container, may crop (good for backgrounds)
<Image resizeMode="cover" />

// contain: Fits within container, may letterbox (good for icons)
<Image resizeMode="contain" />

// stretch: Stretches to fill, may distort (rarely appropriate)
<Image resizeMode="stretch" />

// center: Centers without resizing (good for small images)
<Image resizeMode="center" />
```

**4. Use local images efficiently:**

```tsx
// For static assets, use require()
<Image source={require('./assets/logo.png')} />

// Metro automatically selects the correct resolution (@1x, @2x, @3x)
// based on the device's pixel ratio
```

**5. Specify image dimensions when known:**

```tsx
// Specifying width/height prevents layout shifts as images load
<Image
  source={{ uri: imageUrl }}
  style={{ width: 300, height: 200 }}
/>
```

**6. Use progressive/placeholder loading:**

```tsx
function OptimizedImage({ uri }) {
  return (
    <View>
      <Image source={placeholderImage} style={styles.image} />
      <FastImage source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
    </View>
  );
}
```

**7. Compress images:**

Use tools like Sharp, ImageOptim, or Cloudinary to compress images before hosting them. Modern formats like WebP offer better compression than JPEG/PNG:

```tsx
// Request WebP format from your CDN
const imageUrl = `https://cdn.example.com/image.webp?quality=80&width=400`;
```

**8. Handle memory in lists:**

When displaying many images in a FlatList, memory can spike:

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => (
    <FastImage source={{ uri: item.imageUrl }} style={styles.itemImage} />
  )}
  removeClippedSubviews={true}  // Unmount offscreen images
  windowSize={5}                 // Limit pre-rendered items
  maxToRenderPerBatch={10}       // Control batch rendering
/>
```

**9. Use BlurHash or LQIP for placeholders:**

```tsx
import { BlurHash } from 'react-native-blurhash';

<BlurHash
  blurhash="LGF5]+Yk^6#M@-5c,1J5@[or[Q6."
  style={{ width: 300, height: 200 }}
/>
```

**10. Profile image memory usage:**

Use Xcode's Memory Graph Debugger or Android Studio's Memory Profiler to identify image-related memory issues. Each decoded image consumes `width × height × 4 bytes` of memory.

**Best practices summary:**
- Always serve appropriately sized images (use a CDN with resizing)
- Enable caching (FastImage or custom caching layer)
- Use WebP format when possible
- Set explicit dimensions to prevent layout shifts
- Use `removeClippedSubviews` in lists
- Profile memory usage during development
