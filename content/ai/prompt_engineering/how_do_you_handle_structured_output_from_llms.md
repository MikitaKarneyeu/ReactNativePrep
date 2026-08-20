Structured output from LLMs means getting responses in a specific, parseable format like JSON, XML, CSV, or YAML rather than free-form text. This is essential for integrating LLM outputs into applications that need to process, store, or display the results programmatically.

JSON mode is the most common approach. OpenAI and other providers offer a `response_format` parameter that guarantees valid JSON output:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'Extract entities from the text. Respond with JSON.' },
    { role: 'user', content: 'John Smith works at Acme Corp in New York since 2020.' }
  ],
  response_format: { type: 'json_object' },
});
// Output: {"person": "John Smith", "company": "Acme Corp", "location": "New York", "year": 2020}
```

For more control over the JSON structure, provide a schema in the prompt: "Respond with JSON matching this schema: {\"name\": string, \"age\": number, \"skills\": [string]}". Include examples of the expected output format. Some providers support JSON Schema validation, guaranteeing the output matches your schema exactly.

Function calling is another approach to structured output. Define functions with parameter schemas, and the model returns structured arguments. This is particularly useful for extracting specific fields or making structured decisions. The output is guaranteed to match your parameter schema.

Prompt techniques for reliable structured output include: providing clear examples of the exact format, using delimiters (```json ... ```) to frame the expected output, specifying field names and types explicitly, and asking for specific keys rather than open-ended responses. Use low temperature (0-0.2) for structured output to minimize randomness. Validate outputs in your application code—check that required fields exist, types are correct, and values are within expected ranges. Implement retry logic if validation fails, with a more explicit prompt on the retry. For critical applications, use Pydantic or Zod schemas to validate LLM outputs against your expected data model.