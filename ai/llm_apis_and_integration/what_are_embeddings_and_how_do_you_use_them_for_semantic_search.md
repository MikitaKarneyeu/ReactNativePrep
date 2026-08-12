Embeddings are dense vector representations of text that capture semantic meaning—similar texts produce vectors that are close together in the embedding space. LLM providers offer embedding APIs that convert text into high-dimensional vectors (typically 768-3072 dimensions). These vectors encode the meaning of the text, not just keywords, enabling semantic search where "how to fix a broken screen" matches "repairing a cracked display."

To use embeddings for semantic search, first create an index: convert your documents into chunks, generate embeddings for each chunk using an embedding API (OpenAI's text-embedding-3-small, Cohere's embed-v3), and store them in a vector database (Pinecone, Weaviate, ChromaDB, or pgvector for PostgreSQL). Each stored vector includes the original text as metadata.

At query time, generate an embedding for the user's query using the same embedding model, then perform similarity search against the vector database. The database returns the most similar documents ranked by distance. Common similarity metrics include cosine similarity (measures angle between vectors, good for normalized embeddings), dot product (faster, good for non-normalized), and Euclidean distance (measures straight-line distance).

```python
from openai import OpenAI
client = OpenAI()

# Generate query embedding
response = client.embeddings.create(
  model="text-embedding-3-small",
  input="How do I reset my password?"
)
query_vector = response.data[0].embedding

# Search vector database for similar documents
results = vector_db.query(vector=query_vector, top_k=5)
```

Embedding models are optimized for different use cases. OpenAI's text-embedding-3-small offers a good balance of quality and cost. text-embedding-3-large provides higher quality. Cohere's embed-v3 supports multilingual search. BGE and E5 are strong open-source options. Key considerations include chunk size (smaller chunks for precise matches, larger for more context), embedding dimensionality (larger = more expressive but more storage), and hybrid search (combining semantic search with keyword search for best results). Re-ranking retrieved results with a cross-encoder further improves relevance.