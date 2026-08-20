ReAct (Reasoning + Acting) is a framework for building AI agents that interleaves reasoning traces with action execution. Introduced by Yao et al. in 2022, ReAct prompts the LLM to generate both reasoning thoughts and actions in an alternating pattern, creating a more deliberate and traceable decision-making process.

The ReAct loop follows the pattern: Thought → Action → Observation → Thought → Action → Observation → ... The Thought step is the LLM reasoning about the current state and deciding what to do next. The Action step is executing a tool or operation. The Observation step is the result of the action. This continues until the agent has enough information to provide a final answer.

```
Question: What is the population of the capital of France?

Thought 1: I need to find the capital of France first, then look up its population.
Action 1: search("capital of France")
Observation 1: The capital of France is Paris.

Thought 2: Now I need to find the population of Paris.
Action 2: search("population of Paris 2024")
Observation 2: Paris has a population of approximately 2.1 million (city proper).

Thought 3: I have the answer. The capital of France is Paris with a population of ~2.1 million.
Action 3: finish("The capital of France is Paris, with a population of approximately 2.1 million.")
```

ReAct improves over pure action-based agents by making the reasoning explicit. The thought traces help debug agent behavior—you can see why the agent made each decision. They also improve accuracy by encouraging the model to plan before acting, reducing unnecessary tool calls and wrong turns. The framework naturally handles multi-step problems by decomposing them into a sequence of reasoning and action steps.

In practice, ReAct is implemented by including thought/action/observation examples in the prompt and parsing the model's output to extract actions. LangChain and similar frameworks provide ReAct agent implementations. The framework works with any LLM that supports function calling or structured output. Limitations include the model sometimes getting stuck in reasoning loops, generating invalid actions, or failing to recognize when it has enough information to answer. Guardrails like maximum iteration limits and action validation are essential for production use.