`BrowserRouter` and `HashRouter` are two router implementations in React Router that use different browser APIs to synchronize the UI with the URL. The choice between them affects URL structure, server configuration, and browser compatibility.

**BrowserRouter:**

Uses the HTML5 History API (`pushState`, `replaceState`, `popstate`) to keep the UI in sync with the URL. URLs look clean and standard.

```jsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/users/:id" element={<UserProfile />} />
  </Routes>
</BrowserRouter>

// URLs:
// https://example.com/
// https://example.com/about
// https://example.com/users/123
```

**HashRouter:**

Uses the URL hash fragment (`window.location.hash`) to keep the UI in sync. The hash portion of the URL is never sent to the server.

```jsx
import { HashRouter } from 'react-router-dom';

<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/users/:id" element={<UserProfile />} />
  </Routes>
</HashRouter>

// URLs:
// https://example.com/#/
// https://example.com/#/about
// https://example.com/#/users/123
```

**Key differences:**

| Aspect | BrowserRouter | HashRouter |
|--------|--------------|------------|
| URL format | `/about` | `/#/about` |
| Server config | Required | Not required |
| SEO | Better (clean URLs) | Worse (hash not sent to server) |
| Browser support | HTML5 browsers | All browsers |
| URL sent to server | Yes (full path) | No (hash is client-only) |
| Analytics | Clean tracking | May need configuration |
| Server rendering | Compatible | Not typically used |

**Server configuration for BrowserRouter:**

The server must return `index.html` for all routes, because the client handles routing:

```nginx
# Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

```apache
# Apache (.htaccess)
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

```javascript
// Express.js
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

**Why BrowserRouter is preferred:**

1. **Clean URLs** — `/about` looks professional and is easier to share
2. **SEO** — Search engines index clean URLs more reliably
3. **Server-side rendering** — Compatible with SSR frameworks
4. **Analytics** — URL-based analytics work naturally
5. **Modern standard** — History API is supported in all modern browsers

**When to use HashRouter:**

1. **Static file hosting** — When you can't configure the server (GitHub Pages, S3 static hosting without CloudFront)
2. **Legacy browser support** — When you must support very old browsers (rare)
3. **File protocol** — When the app is opened directly from the file system (`file://`)
4. **Server limitations** — When the server doesn't support URL rewriting

**Other router types:**

```jsx
// MemoryRouter — no URL interaction (testing, React Native)
import { MemoryRouter } from 'react-router-dom';
<MemoryRouter initialEntries={['/about']}>

// StaticRouter — for server-side rendering
import { StaticRouter } from 'react-router-dom/server';
<StaticRouter location="/about">
```

**Migration from HashRouter to BrowserRouter:**

If you start with HashRouter due to hosting limitations and later move to a configurable server:

1. Change `HashRouter` to `BrowserRouter`
2. Configure the server to serve `index.html` for all routes
3. Update any hardcoded hash-based links
4. Set up redirects for old hash URLs if needed
5. Update analytics and SEO configurations

In modern development, `BrowserRouter` is the default choice unless you have a specific constraint that requires `HashRouter`.
