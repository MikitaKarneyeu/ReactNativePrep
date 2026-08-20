HTTPS (HyperText Transfer Protocol Secure) is the secure version of HTTP. It encrypts communication between the client (browser) and server using TLS (Transport Layer Security), ensuring that data transmitted cannot be intercepted, read, or modified by third parties.

**How HTTPS works:**

1. **TCP connection** — Browser connects to server on port 443
2. **TLS handshake** — Client and server negotiate encryption:
   - Client sends supported cipher suites and a random number
   - Server responds with its SSL certificate and a random number
   - Client verifies the certificate with a Certificate Authority (CA)
   - Both parties generate session keys from the random numbers
   - Encrypted communication begins using symmetric encryption
3. **Encrypted HTTP** — All HTTP data is encrypted before transmission

**What HTTPS protects against:**

1. **Eavesdropping** — Attackers on the same network (public WiFi, ISP) cannot read the data. Passwords, session tokens, personal data, and API responses are all encrypted.

2. **Man-in-the-middle attacks** — Attackers cannot intercept and modify data in transit. The TLS certificate verifies the server's identity.

3. **Content injection** — ISPs, proxies, or attackers cannot inject ads, malware, or tracking scripts into your pages.

4. **Cookie/session hijacking** — Without HTTPS, cookies can be stolen from the network and used to impersonate users.

**Why HTTPS is important:**

1. **Security** — Protects user data in transit (login credentials, payment info, personal data)
2. **Trust** — Browsers show security indicators (padlock icon) and warn users about HTTP sites
3. **SEO** — Google uses HTTPS as a ranking signal
4. **Required for modern features** — Service Workers, Geolocation, WebRTC, HTTP/2, and many APIs require a secure context
5. **Regulatory compliance** — GDPR, PCI DSS, and other regulations require encryption
6. **Browser enforcement** — Chrome and Firefox mark HTTP sites as "Not Secure"

**Getting HTTPS:**

```bash
# Free certificates from Let's Encrypt
sudo certbot --nginx -d example.com -d www.example.com

# Or use a CDN/proxy like Cloudflare which provides free SSL
```

**TLS certificate types:**

| Type | Validation | Use Case |
|------|-----------|----------|
| DV (Domain Validation) | Proves domain ownership | Most websites, free (Let's Encrypt) |
| OV (Organization Validation) | Verifies organization | Business sites |
| EV (Extended Validation) | Extensive verification | Banks, e-commerce (less common now) |

**HTTP vs HTTPS:**

| Aspect | HTTP | HTTPS |
|--------|------|-------|
| Port | 80 | 443 |
| Encryption | None | TLS encrypted |
| Data integrity | Not guaranteed | Guaranteed |
| Server identity | Not verified | Verified by certificate |
| SEO | Lower ranking | Ranking boost |
| Browser indicator | "Not Secure" | Padlock icon |
| Performance | Slightly faster (no encryption) | Negligible overhead with HTTP/2 |

**HTTPS best practices:**

1. **Redirect HTTP to HTTPS** — All HTTP requests should redirect to HTTPS
2. **Use HSTS** — Tell browsers to always use HTTPS
3. **Secure cookies** — Set `Secure` flag so cookies are only sent over HTTPS
4. **Keep certificates renewed** — Let's Encrypt auto-renews, but monitor expiration
5. **Use TLS 1.2+** — Disable older, insecure protocols (SSL 3.0, TLS 1.0, TLS 1.1)
6. **Certificate transparency** — Monitor certificate issuance for your domain

```nginx
# Nginx HTTP to HTTPS redirect
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

The performance overhead of TLS is negligible with modern hardware and HTTP/2. The security benefits far outweigh any minor cost, and HTTPS is now considered a baseline requirement for all web applications.
