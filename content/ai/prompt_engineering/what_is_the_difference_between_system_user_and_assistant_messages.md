System, user, and assistant messages are the three roles in the chat completions API format used by modern LLMs. Each role serves a distinct purpose in shaping the model's behavior and the conversation flow.

System messages set the model's behavior, personality, and constraints. They're like instructions to the actor before the play begins. System messages establish the model's role ("You are a helpful coding assistant"), expertise level ("Respond at a senior engineer level"), output format ("Always respond in markdown"), and constraints ("Never provide medical advice"). The system message persists across the entire conversation and influences all subsequent responses. In practice, the system prompt is carefully crafted and rarely changes during a conversation.

User messages represent input from the human—questions, requests, and information. Each user message is the trigger for the model's response. In a conversation, user messages build on previous exchanges, and the model uses the full conversation history to generate contextually appropriate responses. User messages can contain text, images (for vision-capable models), and structured data.

Assistant messages are the model's previous responses in the conversation. Including assistant messages in the conversation history creates multi-turn dialogue—the model can reference its previous answers, maintain consistency, and build on prior context. This is essential for conversational applications where each response depends on what came before.

```javascript
const messages = [
  { role: 'system', content: 'You are a Python expert. Provide concise code solutions.' },
  { role: 'user', content: 'How do I read a CSV file?' },
  { role: 'assistant', content: 'import pandas as pd\ndf = pd.read_csv("file.csv")' },
  { role: 'user', content: 'How do I filter rows where age > 30?' },
];
```

Best practices: keep system messages concise but comprehensive—they're processed for every request. Don't put critical information only in system messages; some models weight user messages more heavily. Use assistant messages to guide the model's behavior—providing a partial assistant response can steer the model toward a desired format. In function calling, tool messages return function results to the model. The conversation history grows with each turn, so implement strategies to manage context window limits.