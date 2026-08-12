Generating embeddings for text data involves passing text through an embedding model that outputs a dense vector representation. The choice of model depends on your requirements for quality, speed, cost, and whether you need to run on-device or via API.

API-based embedding models are the easiest to use. OpenAI's text-embedding-3-small produces 1536-dimensional vectors and offers a good balance of quality and cost. text-embedding-3-large produces 3072-dimensional vectors with higher quality. Cohere's embed-v3 supports multilingual text. To generate embeddings:

```python
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Your text to embed"
)
vector = response.data[0].embedding  # List of 1536 floats
```

Open-source models run locally without API costs. Sentence-Transformers (Python library) provides pre-trained models like all-MiniLM-L6-v2 (384 dimensions, fast) and all-mpnet-base-v2 (768 dimensions, higher quality). BGE and E5 models from Hugging Face offer state-of-the-art open-source quality. These models can run on CPU or GPU and don't require internet access after download.

The embedding process involves preprocessing (cleaning text, handling encoding), chunking (splitting long documents into passages of 200-500 tokens), and batch processing (embedding multiple texts efficiently). For documents, chunk strategically—split at paragraph or section boundaries, include overlapping text between chunks to avoid splitting relevant information, and preserve metadata (source, section title) with each chunk.

Key considerations include dimensionality (higher = more expressive but more storage and slower search), model selection (domain-specific models may outperform general models for specialized content), and consistency (always use the same model for indexing and querying—mixing models produces incompatible vectors). Pre-process text consistently (lowercase, remove special characters, normalize unicode) to ensure similar texts produce similar embeddings. For multilingual content, use multilingual embedding models rather than translating to English first.