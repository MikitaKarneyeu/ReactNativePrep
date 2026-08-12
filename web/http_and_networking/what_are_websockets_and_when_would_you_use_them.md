WebSockets provide full-duplex, bidirectional communication between a client and server over a single TCP connection. Unlike HTTP's request-response model, WebSockets allow the server to push data to the client at any time without the client having to request it.

**Establishing a WebSocket connection:**

The connection starts with an HTTP handshake (upgrade request):

```javascript
// Client-side
const socket = new WebSocket('wss://api.example.com/ws');

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('Connected to WebSocket server');
  socket.send(JSON.stringify({ type: 'join', room: 'general' }));
});

// Listen for messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Message from server:', data);
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('Connection closed:', event.code, event.reason);
});

// Connection error
socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

// Send messages
socket.send(JSON.stringify({ type: 'message', content: 'Hello!' }));

// Close connection
socket.close(1000, 'Normal closure');
```

**Server-side (Node.js with `ws` library):**

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected!' }));
});
```

**WebSocket vs HTTP:**

| Aspect | HTTP | WebSocket |
|--------|------|-----------|
| Communication | Request-response | Bidirectional |
| Connection | New connection per request | Persistent connection |
| Server push | Not natively (polling/SSE needed) | Native support |
| Overhead | Headers with every request | Minimal after handshake |
| Protocol | `http://` / `https://` | `ws://` / `wss://` |
| Latency | Higher (connection setup per request) | Lower (persistent connection) |
| Scaling | Easier (stateless) | Harder (stateful connections) |

**When to use WebSockets:**

1. **Chat applications** — Real-time messaging between users
2. **Live notifications** — Push notifications without polling
3. **Multiplayer games** — Real-time player state synchronization
4. **Collaborative editing** — Google Docs-style real-time collaboration
5. **Live dashboards** — Real-time data feeds (stock prices, metrics)
6. **Sports/live events** — Real-time scores and updates
7. **IoT** — Device communication

**Reconnection pattern:**

```javascript
function createWebSocket() {
  const socket = new WebSocket('wss://api.example.com/ws');

  socket.addEventListener('open', () => {
    console.log('Connected');
    reconnectAttempts = 0;
  });

  socket.addEventListener('close', (event) => {
    if (event.code !== 1000) { // Not a clean closure
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => {
        reconnectAttempts++;
        createWebSocket();
      }, delay);
    }
  });

  return socket;
}
```

**Alternatives to WebSockets:**

- **Server-Sent Events (SSE)** — Server-to-client only, simpler, uses HTTP
- **Long Polling** — Client repeatedly requests; higher overhead
- **HTTP/2 Server Push** — Push resources but not arbitrary messages
- **WebRTC** — Peer-to-peer communication (for video/audio/data channels)

**Scaling considerations:**

WebSockets maintain persistent connections, which means:
- Each connection consumes server memory and file descriptors
- Load balancing requires sticky sessions or shared state (Redis pub/sub)
- Horizontal scaling needs a message broker to broadcast across servers
- Connection limits per server must be carefully managed
