Obfuscation is the process of transforming code to make it difficult to understand while preserving its functionality. In React Native, the JavaScript bundle is shipped as text, making it vulnerable to reverse engineering. Obfuscation protects intellectual property and makes tampering harder.

**What obfuscation does:**

1. **Renames variables and functions**: `calculateTotal` becomes `_0x3a2f`
2. **Control flow flattening**: Makes the execution path harder to follow
3. **String encryption**: Encrypts string literals and decodes them at runtime
4. **Dead code injection**: Adds unreachable code to confuse analysis
5. **Anti-tampering**: Adds self-defending code that detects modifications

**Using react-native-obfuscating-transformer:**

```bash
npm install --save-dev react-native-obfuscating-transformer javascript-obfuscator
```

Configure in `metro.config.js`:

```tsx
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('react-native-obfuscating-transformer'),
      obfuscatorOptions: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.75,
        stringArrayEncoding: ['base64'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
      },
    },
  };
})();
```

**Only obfuscate production builds:**

```tsx
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  transformer: {
    babelTransformerPath: isProduction
      ? require.resolve('react-native-obfuscating-transformer')
      : require.resolve('metro-react-native-babel-transformer'),
    obfuscatorOptions: isProduction ? { /* obfuscation options */ } : undefined,
  },
};
```

**Using Jscrambler (commercial):**

Jscrambler provides enterprise-grade obfuscation with advanced techniques:

```json
// .jscramblerrc
{
  "keys": {
    "accessKey": "YOUR_ACCESS_KEY",
    "secretKey": "YOUR_SECRET_KEY"
  },
  "applicationId": "YOUR_APP_ID",
  "params": [
    { "name": "stringSplitting", "options": { "size": 5 } },
    { "name": "functionReordering" },
    { "name": "deadCodeInjection" },
    { "name": "identifiersRenaming" },
    { "name": "selfDefending" }
  ]
}
```

**Obfuscation configuration levels:**

**Low (fast build, basic protection):**
```tsx
{
  compact: true,
  identifierNamesGenerator: 'hexadecimal',
  stringArray: true,
  stringArrayThreshold: 0.5,
}
```

**Medium (balanced):**
```tsx
{
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  identifierNamesGenerator: 'hexadecimal',
  stringArray: true,
  stringArrayEncoding: ['base64'],
  selfDefending: true,
}
```

**High (slow build, maximum protection):**
```tsx
{
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  debugProtection: true,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
}
```

**Impact of obfuscation:**

- **Bundle size**: Increases by 20-50% due to injected code and encoded strings
- **Startup time**: Slight increase due to string decoding and dead code evaluation
- **Debugging**: Production debugging becomes very difficult (intentional)
- **Source maps**: Generate before obfuscation, upload to crash reporting service

**What obfuscation does NOT protect against:**
- Runtime inspection (React DevTools, debugger)
- Network traffic analysis
- API endpoint discovery
- Determined reverse engineers with enough time

**Best practices:**
- Only obfuscate production builds
- Upload source maps to Sentry/Bugsnag before obfuscating
- Test thoroughly after obfuscation—some options can break code
- Start with medium settings and increase if needed
- Don't rely on obfuscation alone—it's one layer of defense
- Combine with certificate pinning, root detection, and secure storage
- Monitor build times—high obfuscation significantly slows builds
