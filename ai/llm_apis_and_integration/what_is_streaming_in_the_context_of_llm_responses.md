Streaming in LLM APIs means receiving the response incrementally as tokens are generated, rather than waiting for the entire response to complete before returning anything. Instead of a single HTTP response containing the full text, the server sends Server-Sent Events (SSE) or chunked transfer encoding, with each chunk containing one or a few tokens. This provides a dramatically better user experience—users see text appearing word by word, similar to how ChatGPT works.

Without streaming, a 500-word response might take 10-15 seconds to generate, during which the user sees nothing and may think the application is broken. With streaming, the first token appears in 200-500ms, and subsequent tokens appear every 50-100ms. The perceived latency is much lower even though total generation time is the same. Users can start reading the response immediately and can cancel if the response isn't what they wanted.

Implementing streaming differs by platform. On the web, use EventSource or the Fetch API with ReadableStream:

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message }),
  headers: { 'Content-Type': 'application/json' },
});
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // Process chunk - each contains a token or few tokens
  appendToUI(chunk);
}
```

For mobile apps, use URLSession (iOS) or OkHttp (Android) with streaming response handling. Backend implementations proxy the stream from the LLM API to the client—Node.js uses `res.write()`, Python uses `StreamingResponse` in FastAPI. Key considerations include handling connection drops gracefully (reconnecting and resuming), buffering tokens for efficient rendering (batch updates to UI every 50-100ms rather than per-token), and implementing cancel functionality. Streaming is essential for any user-facing LLM application—non-streaming responses feel unresponsive and dated.