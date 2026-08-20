Metro is the JavaScript bundler for React Native, developed by Meta. It is responsible for transforming, bundling, and serving your JavaScript code to the React Native runtime during development and production builds.

**Core responsibilities:**

1. **Module Resolution**: Metro resolves your `import` and `require()` statements, building a dependency graph starting from your entry file (usually `index.js`). It traverses all imports recursively to include every module your app needs.

2. **Transformation**: Metro uses Babel (and optionally other transformers) to transform your code. This includes JSX transformation, TypeScript/Flow stripping, syntax downleveling for the target platform, and platform-specific code handling (`.ios.js` / `.android.js` file resolution).

3. **Bundling**: Metro bundles all resolved modules into one or more JavaScript bundle files that the React Native runtime can load. In development, it serves the bundle over HTTP; for production, it writes a static bundle file.

4. **Hot Module Replacement (HMR)**: In development, Metro watches for file changes and sends incremental updates to the running app. This enables Fast Refresh (formerly Hot Reloading), which updates your app state-preserving component changes without a full reload.

5. **Minification and Optimization**: In production builds, Metro minifies the bundle, removes dead code (tree shaking), and applies optimizations to reduce bundle size and improve startup performance.

**Metro configuration** is typically in `metro.config.js`:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

**Why Metro over Webpack:**
- Metro is designed specifically for React Native's platform requirements (multi-platform resolution, native module integration)
- It has first-class support for Fast Refresh
- It understands React Native's module system and platform-specific file extensions
- It's optimized for mobile bundle delivery and incremental builds

Metro is the default bundler for React Native CLI projects. Expo also uses Metro under the hood.
