Single-turn conversations consist of one user message and one assistant response—each interaction is independent with no memory of previous exchanges. The user asks a question, the model responds, and the conversation is complete. This is suitable for one-off tasks: translation, summarization, classification, or simple Q&A. Each request includes only the current query, with no conversation history.

Multi-turn conversations maintain context across multiple exchanges. The user can ask follow-up questions, reference previous responses, and build on prior context. This requires tracking conversation history and including previous messages in each API call. Multi-turn is essential for chatbots, interactive assistants, and any application where users expect the model to remember what was discussed.

The technical difference is how messages are managed. Single-turn sends only the current user message. Multi-turn sends the full conversation history:

```javascript
// Multi-turn conversation management
const conversationHistory = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is machine learning?' },
  { role: 'assistant', content: 'Machine learning is a subset of AI...' },
  { role: 'user', content: 'How does it differ from deep learning?' },
  // History grows with each turn
];
```

Multi-turn conversations face challenges that single-turn doesn't. Context window limits constrain how much history can be included—long conversations must be summarized or truncated. Conversation coherence requires the model to maintain consistency across turns. User references ("what about the other one?", "can you explain that further?") require understanding the conversation context. Cost increases with conversation length since you're sending more tokens with each request.

Best practices for multi-turn include: implementing sliding windows (keep last N messages), summarizing older messages to compress context, storing conversation state server-side for persistence, and handling conversation branching (when users go back to change previous messages). For production chatbots, persist conversations to a database, implement conversation timeouts, and provide clear UI indicators of conversation state. The choice between single-turn and multi-turn depends on the use case—simple tools use single-turn, interactive applications use multi-turn.