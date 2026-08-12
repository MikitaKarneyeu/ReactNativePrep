Consistent output from LLMs requires structured prompts that minimize ambiguity and clearly define the expected response format. The key is to leave as little as possible to the model's interpretation—specify the format, length, style, and constraints explicitly.

Define the output format explicitly. If you want JSON, provide a schema: "Respond with valid JSON matching this schema: {\"summary\": string, \"confidence\": number, \"sentiment\": \"positive\" | \"negative\" | \"neutral\"}". For structured text, provide a template: "Respond in this format:\nSummary: [one sentence]\nKey Points:\n- [point 1]\n- [point 2]\n- [point 3]". Many providers support JSON mode which guarantees valid JSON output.

Use system prompts to establish persistent behavior. The system prompt sets the model's role, constraints, and output style that apply across all interactions:

```javascript
const systemPrompt = `You are a technical documentation assistant. 
Rules:
- Always respond in markdown format
- Include code examples where relevant
- Keep explanations concise (under 200 words)
- If unsure, say "I'm not certain about this"
- Never fabricate API endpoints or function signatures`;
```

Provide examples of desired output. Include 1-2 examples of the exact format you expect. This is especially important for complex or unusual formats. The model will mimic the examples more reliably than following abstract instructions.

Constrain the response with explicit boundaries. Specify maximum length ("Respond in 2-3 sentences"), content restrictions ("Only include factual information from the provided context"), and style guidelines ("Use formal language, avoid contractions"). Use delimiters to separate instructions from content: triple backticks, XML tags, or clear section headers. This prevents the model from confusing instructions with content.

Test prompts across multiple runs to verify consistency. LLMs have inherent randomness—run the same prompt 10-20 times and check for variation. If outputs vary significantly, add more constraints or reduce temperature. Version control your prompts and track which versions produce the most consistent results. In production, implement validation logic to reject outputs that don't match the expected format.