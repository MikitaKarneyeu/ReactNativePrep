Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources fetched from a CDN or third-party server have not been tampered with. It works by checking the resource's cryptographic hash against a hash you specify in the HTML.

**How SRI works:**

1. You calculate the hash of the resource file (e.g., a CSS or JS file from a CDN)
2. You include the hash in the `integrity` attribute of the `<script>` or `<link>` tag
3. The browser downloads the resource, calculates its hash, and compares it to the specified hash
4. If the hashes match, the resource is executed. If not, the browser blocks it.

**Basic usage:**

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>

<link
  rel="stylesheet"
  href="https://cdn.example.com/styles.css"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
```

**Generating SRI hashes:**

```bash
# Using openssl
cat file.js | openssl dgst -sha384 -binary | openssl base64 -A

# Using shasum
shasum -b -a 384 file.js | awk '{print $1}' | xxd -r -p | base64

# Using the sri-tool (npm)
npx sri --algorithm sha384 file.js

# Online tool: https://www.srihash.org/
```

**Multiple hashes (for multiple algorithms):**

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-abc123... sha512-def456..."
  crossorigin="anonymous">
</script>
```

**Why SRI is important:**

1. **CDN compromise protection** — If a CDN is hacked and serves malicious code, SRI will block it
2. **Supply chain attacks** — Protects against compromised third-party libraries
3. **Accidental modification** — Detects if a file was accidentally corrupted during transfer
4. **Compliance** — Some security standards require integrity verification

**Practical example:**

```html
<!-- Bootstrap from CDN with SRI -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossorigin="anonymous">

<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
  crossorigin="anonymous">
</script>
```

**The `crossorigin` attribute:**

SRI requires the `crossorigin` attribute because the browser needs to make a CORS request to read the response body and verify the hash. Without it, the browser can load the resource but cannot check its integrity.

- `crossorigin="anonymous"` — CORS request without credentials
- `crossorigin="use-credentials"` — CORS request with credentials

**Limitations of SRI:**

1. **Static resources only** — Cannot verify dynamically generated content
2. **Version pinning** — Hash changes with every update, so you must update the hash when the library updates
3. **Not all resources** — Works with `<script>`, `<link>`, and a few other tags; doesn't work with `<img>` in most browsers
4. **CDN versioning** — If you use `@latest` or unversioned URLs, SRI breaks on every update
5. **Fallback complexity** — If the CDN is down and you have a local fallback, you need matching SRI hashes for both

**SRI with fallback:**

```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-abc123"
  crossorigin="anonymous"
  onerror="loadLocalFallback()"></script>
<script>
function loadLocalFallback() {
  const s = document.createElement('script');
  s.src = '/local/library.js';
  document.body.appendChild(s);
}
</script>
```

**Best practices:**

1. Use SRI for all third-party CDN resources
2. Pin specific versions (don't use `@latest`)
3. Use SHA-384 or SHA-512 (SHA-256 is acceptable but weaker)
4. Keep hashes updated when upgrading libraries
5. Use build tools to auto-generate SRI hashes (Webpack `webpack-subresource-integrity` plugin)

SRI is a simple but powerful defense against supply chain attacks and is especially important when loading resources from third-party CDNs.
