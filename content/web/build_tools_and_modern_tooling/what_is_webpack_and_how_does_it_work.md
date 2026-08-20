Webpack is a static module bundler for JavaScript applications. It takes modules with their dependencies and generates optimized bundles for the browser. It processes every asset in your project — JavaScript, CSS, images, fonts — as a module, creating a dependency graph and producing one or more output bundles.

**How Webpack works:**

1. **Entry** — Webpack starts from one or more entry points (the root of your dependency graph)
2. **Dependency graph** — It follows `import`/`require` statements to build a graph of all dependencies
3. **Loaders** — Transform non-JavaScript files (CSS, images, TypeScript) into modules
4. **Plugins** — Perform broader tasks (minification, environment variables, HTML generation)
5. **Output** — Generates optimized bundles in the specified output directory

**Basic configuration:**

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js', // Cache-busting filenames
    clean: true // Clean dist folder before build
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true
  }
};
```

**Key concepts:**

**Entry:**
```javascript
entry: './src/index.js'
// Or multiple entries
entry: {
  main: './src/index.js',
  admin: './src/admin.js'
}
```

**Output:**
```javascript
output: {
  filename: '[name].[contenthash].js', // [name] = entry name, [contenthash] = cache busting
  chunkFilename: '[name].[contenthash].js', // For code-split chunks
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/' // URL prefix for assets
}
```

**Loaders** transform files during the build:
```javascript
module: {
  rules: [
    { test: /\.tsx?$/, use: 'ts-loader' },
    { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
    { test: /\.svg$/, type: 'asset/inline' }
  ]
}
```

**Plugins** extend Webpack's capabilities:
```javascript
plugins: [
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  new CopyWebpackPlugin({ patterns: [{ from: 'public', to: '.' }] }),
  new BundleAnalyzerPlugin()
]
```

**Code splitting:**
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors' }
    }
  }
}

// Dynamic import for route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

**Development vs production:**

```javascript
// Development
mode: 'development',
devtool: 'eval-source-map',
devServer: { hot: true }

// Production
mode: 'production',
devtool: 'source-map',
optimization: { minimize: true }
```

**Webpack ecosystem:**

- **webpack-dev-server** — Development server with HMR
- **webpack-merge** — Merge configurations (base, dev, prod)
- **terser-webpack-plugin** — JavaScript minification
- **css-minimizer-webpack-plugin** — CSS minification
- **webpack-bundle-analyzer** — Visualize bundle contents

**Why Webpack is still relevant:**

Despite newer tools like Vite, Webpack remains widely used because of:
- Mature ecosystem with extensive plugins and loaders
- Fine-grained configuration for complex use cases
- Battle-tested in large enterprise applications
- Module Federation for micro-frontends
- Extensive customization capabilities
