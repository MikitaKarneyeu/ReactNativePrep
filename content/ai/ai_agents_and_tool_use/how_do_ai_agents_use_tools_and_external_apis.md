AI agents use tools through function calling—the LLM outputs a structured request specifying which tool to call and what arguments to pass. The agent framework executes the function, returns the result to the LLM, and the LLM decides what to do next. This creates a loop where the LLM reasons about the problem, selects appropriate tools, processes results, and iterates until the task is complete.

Tool definition involves describing each tool's purpose, parameters, and expected output in a format the LLM can understand. Clear descriptions are critical—the model uses them to decide when and how to use each tool:

```python
tools = [
    {
        "name": "search_database",
        "description": "Search the product database. Use for finding product information, prices, and availability.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "category": {"type": "string", "enum": ["electronics", "clothing", "books"]},
                "max_results": {"type": "integer", "description": "Maximum results to return"}
            },
            "required": ["query"]
        }
    }
]
```

The agent loop works as follows: receive user request, LLM analyzes the request and decides which tool(s) to call, framework executes the tool with the LLM's arguments, result is returned to the LLM, LLM decides if more actions are needed or if it has enough information to respond. This loop continues until the LLM produces a final answer or reaches a maximum iteration limit.

External API integration follows the same pattern. Wrap API calls as tools with clear descriptions. The agent can call weather APIs, search engines, payment processors, CRM systems, and any other service. Security considerations include: validating tool arguments before execution (don't trust LLM output blindly), implementing permission controls (some tools require confirmation), rate limiting tool calls, and sandboxing dangerous operations (code execution, file system access). In production, implement human-in-the-loop approval for high-stakes actions like sending emails, making purchases, or modifying data.