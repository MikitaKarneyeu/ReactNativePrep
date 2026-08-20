Autocomplete and text suggestions predict the next word or phrase as the user types, reducing typing effort and improving accuracy. Modern implementations use language models to provide context-aware suggestions that adapt to the user's writing style and the current conversation context.

The simplest approach uses n-gram models or trie data structures to suggest completions based on statistical patterns in text data. Given the previous words, the system suggests the most probable next words. This is fast and works offline but lacks deep contextual understanding. It's suitable for basic autocomplete in search bars and forms.

Modern approaches use small language models fine-tuned for next-word prediction. Models like GPT-2 small or custom Transformer models can run on-device or via API. For on-device performance, use quantized models optimized for mobile inference. The model takes the current text as input and generates probability distributions over the vocabulary for the next token.

```python
# Server-side autocomplete using LLM API
async def get_suggestions(partial_text, num_suggestions=3):
    response = await openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role": "system",
            "content": "Complete the following text. Provide 3 possible continuations, each 1-3 words, separated by |"
        }, {
            "role": "user",
            "content": partial_text
        }],
        temperature=0.7,
        max_tokens=50
    )
    return response.choices[0].message.content.split("|")
```

For email and messaging apps, personalized suggestions learn from the user's past messages, adapting to their vocabulary, style, and common phrases. This requires on-device training or federated learning to preserve privacy. Smart Compose (as in Gmail) suggests complete phrases, not just next words—this requires generating multi-token suggestions efficiently.

Performance considerations are critical for autocomplete. Users expect suggestions within 50-100ms—any slower feels unresponsive. Use a small, fast model for real-time suggestions and a larger model for "deeper" suggestions triggered explicitly. Cache common suggestions aggressively. Debounce API calls—wait for the user to pause typing before requesting suggestions. For on-device models, pre-compute suggestions as the user types each character. Display suggestions in a non-intrusive way that doesn't obstruct the typing area.