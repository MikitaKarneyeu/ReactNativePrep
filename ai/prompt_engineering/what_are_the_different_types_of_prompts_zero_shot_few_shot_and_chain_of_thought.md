Zero-shot prompts ask the model to perform a task without providing any examples. The prompt consists of the task instruction and the input: "Classify this review as positive or negative: 'The food was amazing and the service was excellent.'" The model relies entirely on its pre-training knowledge to understand the task. Zero-shot works well for common tasks the model has seen during training but may struggle with unusual formats or domain-specific tasks.

Few-shot prompts provide examples before the task input, demonstrating the expected input-output pattern. This "teaches" the model the task through examples in the prompt:

```
Classify the sentiment:
Review: "Terrible experience, never coming back" -> Negative
Review: "Loved every minute of it" -> Positive
Review: "It was okay, nothing special" -> Neutral
Review: "The food was amazing" ->
```

Few-shot is more reliable than zero-shot for tasks with specific formatting, domain-specific conventions, or ambiguous requirements. The examples act as a soft form of training. Best practices include using diverse examples that cover edge cases, keeping examples consistent in format, and using 3-5 examples (more examples increase context usage without proportional quality improvement).

Chain-of-thought (CoT) prompting asks the model to reason step-by-step before giving the final answer. This significantly improves performance on math, logic, and multi-step reasoning tasks. "Let's think step by step" is the simplest form. More structured CoT prompts outline the reasoning process:

```
Question: If I have 3 apples and buy 2 bags of apples with 6 apples each, how many do I have?
Let me think step by step:
1. I start with 3 apples
2. I buy 2 bags with 6 apples each = 2 × 6 = 12 apples
3. Total = 3 + 12 = 15 apples
Answer: 15
```

Other prompt types include self-consistency (generating multiple reasoning paths and selecting the most common answer), tree-of-thought (exploring multiple reasoning branches), and role-based prompts (assigning the model a specific persona or expertise level). In practice, the choice depends on task complexity—simple classification needs zero-shot or few-shot, while complex reasoning benefits from chain-of-thought.