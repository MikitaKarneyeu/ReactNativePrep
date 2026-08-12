Environment variables in frontend applications allow you to configure different values for development, staging, and production environments without changing your source code. They are used for API URLs, feature flags, API keys (non-sensitive), and other configuration that varies by environment.

**How environment variables work:**

Environment variables are injected at build time, not runtime. The build tool replaces references to environment variables with their actual values in the output bundle.

**Vite:**

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.production.com
```

```javascript
// Access in code (must be prefixed with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
const title = import.meta.env.VITE_APP_TITLE;

// Built-in variables
import.meta.env.MODE;        // 'development' or 'production'
import.meta.env.PROD;        // boolean
import.meta.env.DEV;         // boolean
import.meta.env.SSR;         // boolean
```

**Webpack (with DefinePlugin or dotenv-webpack):**

```javascript
// webpack.config.js
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
```

```javascript
// Access in code
const apiUrl = process.env.API_URL;
```

**Create React App (deprecated but still common):**

```bash
# Variables must be prefixed with REACT_APP_
REACT_APP_API_URL=https://api.example.com
REACT_APP_VERSION=1.0.0
```

```javascript
// Access in code
const apiUrl = process.env.REACT_APP_API_URL;
```

**Next.js:**

```bash
# .env.local (not committed to git)
DATABASE_URL=postgresql://...

# .env (committed to git)
NEXT_PUBLIC_API_URL=https://api.example.com

# Server-side only (no prefix)
SECRET_KEY=abc123
```

```javascript
// Client-side (must be prefixed with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side (no prefix needed)
const secretKey = process.env.SECRET_KEY;
```

**Environment file precedence:**

```
.env                  # Loaded in all environments
.env.local            # Loaded in all environments, ignored by git
.env.development      # Loaded in development
.env.development.local # Loaded in development, ignored by git
.env.production       # Loaded in production
.env.production.local # Loaded in production, ignored by git
```

**Security considerations:**

1. **Never commit secrets** — API keys, passwords, and tokens should never be in `.env` files committed to git. Use `.env.local` or `.env.example` (with placeholder values).

2. **Environment variables are public** — In frontend applications, all environment variables are embedded in the client bundle and visible to anyone who inspects the code. Never put sensitive data in frontend environment variables.

```javascript
// ❌ WRONG — sensitive data in frontend env
VITE_API_SECRET=abc123; // Visible in the browser!

// ✅ CORRECT — only non-sensitive configuration
VITE_API_URL=https://api.example.com;
VITE_FEATURE_FLAG_NEW_UI=true;
```

3. **Server-side secrets** — Sensitive values (database URLs, API secrets, private keys) should only be used on the server (SSR, API routes) and never prefixed with `VITE_`/`REACT_APP_`/`NEXT_PUBLIC_`.

**Runtime vs build-time environment variables:**

```javascript
// Build-time (embedded in bundle at build time)
const apiUrl = import.meta.env.VITE_API_URL;

// Runtime (fetched from server or injected via window object)
// index.html
<script>
  window.__ENV__ = {
    API_URL: '<%= API_URL %>' // Injected by server
  };
</script>

// Or fetched from a config endpoint
const config = await fetch('/api/config').then(r => r.json());
```

**Using .env.example:**

```bash
# .env.example (committed to git — documents required variables)
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=My App
```

**Best practices:**

1. Use `.env.example` to document required environment variables
2. Add `.env.local` and `.env.*.local` to `.gitignore`
3. Never put secrets in frontend environment variables
4. Use different `.env` files for different environments
5. Validate required environment variables at build time or startup
6. Use TypeScript for environment variable type safety

```javascript
// Type-safe environment variables (Vite)
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}
```
