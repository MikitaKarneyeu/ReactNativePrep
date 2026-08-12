Integrating an LLM API involves making HTTP requests from your application to the provider's endpoint with your prompt and parameters, then handling the response. Most providers offer REST APIs with SDKs for popular languages. The basic flow is: construct a request with your API key, model selection, messages/prompt, and parameters (temperature, max tokens), send it via HTTP POST, and parse the response containing the generated text.

For web applications, the typical architecture uses a backend server to proxy LLM requests. Never expose API keys in client-side code—send the user's input to your server, make the API call server-side, and return the result. This protects your API key and allows you to implement rate limiting, caching, and input validation. For example, a Next.js application might have an API route that calls OpenAI's SDK:

```javascript
// app/api/chat/route.js
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { message } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  });
  return Response.json({ reply: response.choices[0].message.content });
}
```

For mobile applications (iOS/Android), the same proxy pattern applies. The app sends requests to your backend, which calls the LLM API. For on-device inference, use Core ML (iOS) or TensorFlow Lite (Android) with smaller models, but most LLM interactions go through cloud APIs due to model size requirements.

Key integration considerations include error handling (API failures, rate limits, timeouts), streaming responses for better UX (showing tokens as they're generated), conversation history management (tracking messages for multi-turn conversations), and cost management (monitoring token usage). Use structured output formats (JSON mode) when you need parseable responses. Implement retry logic with exponential backoff for transient failures, and set reasonable timeouts to prevent hanging requests.