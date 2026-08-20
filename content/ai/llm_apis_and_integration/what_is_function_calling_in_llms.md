Function calling (also called tool use) allows LLMs to request the execution of predefined functions as part of their response. Instead of the model trying to generate answers from its training data, it can call external tools to get real-time information or perform actions. The model doesn't execute functions directly—it outputs a structured request specifying which function to call and what arguments to pass. Your application executes the function and returns the result to the model.

The workflow is: define available functions with their parameters and descriptions, send a user query to the LLM with these function definitions, the model decides if a function call is needed and returns a structured JSON request, your code executes the function, and you send the function's result back to the model for final response generation.

```javascript
const tools = [{
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['location'],
    },
  },
}];

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'What is the weather in Tokyo?' }],
  tools,
  tool_choice: 'auto',
});

if (response.choices[0].message.tool_calls) {
  const toolCall = response.choices[0].message.tool_calls[0];
  const result = await getWeather(JSON.parse(toolCall.function.arguments));
  // Send result back to model for final response
}
```

Function calling enables building agents that interact with databases, APIs, and external services. Use cases include querying databases, searching the web, sending emails, booking appointments, controlling smart home devices, and executing code. The model acts as a reasoning engine that decides which tools to use and in what order, while your code handles the actual execution.

Best practices include clear function descriptions (the model uses these to decide when to call functions), well-defined parameter schemas with types and descriptions, handling function errors gracefully (return error messages to the model so it can recover), and limiting the number of available functions (too many confuse the model). Implement validation on function arguments—don't trust the model's output blindly. For multi-step workflows, implement a loop where the model can call multiple functions sequentially to complete complex tasks.