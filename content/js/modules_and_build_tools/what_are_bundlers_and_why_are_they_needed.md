A bundler is a build tool that combines multiple JavaScript modules (and their dependencies) into optimized output files suitable for deployment. Common bundlers include Webpack, Rollup, esbuild, Vite, and Parcel.

**Why bundlers are needed**:

1. **Browser compatibility**: Browsers historically did not support modules natively, and even with ES Modules support, loading hundreds of individual HTTP requests is slow. Bundlers combine modules into fewer files.

2. **Dependency resolution**: Modules import other modules. Bundlers build a dependency graph and resolve all imports into a coherent output.

3. **Code transformations**: Bundlers integrate with loaders/plugins to transform code:
   - Transpiling modern JS/TypeScript (Babel, SWC, esbuild)
   - Compiling CSS preprocessors
   - Optimizing images
   - Injecting environment variables

4. **Optimizations**:
   - **Tree shaking**: Remove unused code
   - **Minification**: Reduce file size (Terser, esbuild)
   - **Code splitting**: Break code into chunks loaded on demand
   - **Caching**: Content-hashed filenames for long-term caching
   - **Dead code elimination**: Remove unreachable code

5. **Development experience**: Hot Module Replacement (HMR), source maps, dev servers.

**How a bundler works** (simplified):

1. Entry point: Starts from a main file (e.g., `index.js`)
2. Dependency graph: Recursively resolves all `import`/`require` statements
3. Transformation: Applies loaders/plugins to each file
4. Output: Generates optimized bundles (possibly multiple chunks)

**Bundler comparison**:

| Bundler | Speed | Tree shaking | Config | Best for |
|---------|-------|-------------|--------|----------|
| Webpack | Moderate | Good | Complex | Large apps, ecosystem |
| Rollup | Fast | Excellent | Moderate | Libraries |
| esbuild | Very fast | Good | Minimal | Speed-critical builds |
| Vite | Fast (esbuild + Rollup) | Good | Minimal | Modern dev experience |
| Parcel | Fast | Good | Zero-config | Quick setup |

Modern development has moved toward faster bundlers (esbuild, Vite) that leverage native ES Modules for development and only bundle for production. Deno and Bun also have built-in bundling capabilities.
