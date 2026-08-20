Error recovery in AI agent workflows requires handling failures at multiple levels: tool execution errors, LLM reasoning errors, and workflow-level failures. A robust agent should detect errors, attempt recovery, and gracefully degrade when recovery isn't possible.

Tool execution errors (API timeouts, invalid arguments, permission denied) should be handled with retries and fallbacks. Implement exponential backoff for transient errors. If a tool fails, provide the error message to the LLM so it can adjust its approach—try different arguments, use an alternative tool, or inform the user. Log all tool errors for debugging.

```python
async def execute_with_recovery(tool, args, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = await tool.execute(args)
            return result
        except TransientError as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
            else:
                return f"Tool failed after {max_retries} attempts: {e}"
        except PermanentError as e:
            return f"Tool error: {e}. Try a different approach."
```

LLM reasoning errors (wrong tool selection, hallucinated arguments, misunderstanding context) require validation and correction. After the LLM selects a tool, validate the arguments against the schema before execution. If the model generates invalid actions, provide feedback and ask it to try again with more context about what went wrong. Implement output validation—check if the LLM's response makes sense in context before acting on it.

Workflow-level errors include exceeding maximum iterations, getting stuck in loops, and failing to complete the overall task. Implement circuit breakers that stop execution when the agent is clearly stuck. Detect loops by tracking action history—if the same action is repeated with similar arguments, force an alternative. Set maximum execution time limits. When a workflow fails, provide a graceful fallback: return partial results, explain what was accomplished and what failed, or escalate to a human.

Production agents need comprehensive observability. Log every action, tool call, LLM decision, and error. Trace the full execution path for debugging. Monitor error rates, average completion time, and success rates. Set up alerts for anomalous patterns (sudden spike in errors, agent getting stuck frequently). Implement health checks and auto-restart for long-running agents. The goal is not to eliminate errors but to detect them quickly, recover gracefully, and continuously improve based on failure patterns.