WebSockets provide full-duplex, real-time communication between the client and server. In React Native, WebSockets are used for chat, live updates, multiplayer games, and any feature requiring real-time data.

**Basic WebSocket usage:**

React Native includes a built-in WebSocket implementation:

```tsx
function useWebSocket(url) {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { messages, isConnected, sendMessage };
}
```

**With automatic reconnection:**

```tsx
function useReconnectingWebSocket(url, options = {}) {
  const { maxRetries = 5, retryDelay = 1000 } = options;
  const wsRef = useRef(null);
  const retryCount = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      retryCount.current = 0;
    };

    ws.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (retryCount.current < maxRetries) {
        const delay = retryDelay * Math.pow(2, retryCount.current);
        setTimeout(() => {
          retryCount.current += 1;
          connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [url, maxRetries, retryDelay]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastMessage, send };
}
```

**Chat implementation:**

```tsx
function ChatScreen({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const ws = useReconnectingWebSocket(
    `wss://api.example.com/chat/${roomId}`
  );

  useEffect(() => {
    if (ws.lastMessage) {
      if (ws.lastMessage.type === 'message') {
        setMessages((prev) => [...prev, ws.lastMessage.data]);
      }
    }
  }, [ws.lastMessage]);

  const handleSend = () => {
    if (input.trim()) {
      ws.send({ type: 'message', text: input });
      setInput('');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}
```

**Using Socket.IO (popular library):**

```tsx
import { io } from 'socket.io-client';

const socket = io('https://api.example.com', {
  transports: ['websocket'],
  autoConnect: false,
});

function useSocket() {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => console.log('Connected'));
    socket.on('message', handleMessage);
    socket.on('disconnect', () => console.log('Disconnected'));

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  const sendMessage = (data) => socket.emit('message', data);

  return { sendMessage };
}
```

**Heartbeat/ping to keep connection alive:**

```tsx
useEffect(() => {
  const pingInterval = setInterval(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000); // Every 30 seconds

  return () => clearInterval(pingInterval);
}, []);
```

**Best practices:**
- Implement reconnection with exponential backoff
- Send heartbeats to detect connection drops
- Close WebSocket connections when components unmount
- Handle background/foreground transitions (reconnect when app comes to foreground)
- Use JSON for message format (easy to parse and debug)
- Queue messages when disconnected and send when reconnected
- Handle authentication (send token on connection or as first message)
- Consider using Socket.IO for higher-level features (rooms, namespaces, automatic reconnection)
