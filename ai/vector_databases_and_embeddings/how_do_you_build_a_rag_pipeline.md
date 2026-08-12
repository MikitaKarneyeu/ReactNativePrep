Building a RAG (Retrieval-Augmented Generation) pipeline involves four main stages: document processing, embedding and indexing, retrieval, and generation. Each stage has important design decisions that affect the quality of the final output.

Document processing: collect your knowledge base (documentation, articles, PDFs, databases), then split documents into chunks of 200-500 tokens. Chunking strategy matters—split at natural boundaries (paragraphs, sections), include overlapping text between chunks to avoid splitting relevant information, and preserve metadata (source, title, date) with each chunk. Clean the text (remove formatting artifacts, handle special characters).

Embedding and indexing: generate embeddings for each chunk using an embedding model (OpenAI text-embedding-3-small, Cohere embed-v3, or open-source alternatives). Store the embeddings and original text in a vector database (Pinecone, Weaviate, ChromaDB, pgvector). Also store metadata for filtering. Build an index structure (HNSW, IVF) for efficient similarity search.

Retrieval: given a user query, generate its embedding and perform similarity search against the vector database. Retrieve the top-k most relevant chunks (typically k=3-10). Improve retrieval quality with query expansion (generating multiple query variations), hybrid search (combining semantic and keyword search), and re-ranking (using a cross-encoder to re-rank retrieved chunks by relevance). Filter by metadata when applicable (date range, document type).

Generation: construct a prompt that includes the retrieved context and the user's query:

```python
prompt = f"""Answer the question based on the context below. If the context doesn't contain the answer, say "I don't have enough information."

Context:
{retrieved_chunks}

Question: {user_query}

Answer:"""
```

Send this prompt to the LLM and return the response. Include source citations so users can verify information. Advanced techniques include multi-step retrieval (querying multiple times with refined queries), self-RAG (the model decides when to retrieve), and adaptive retrieval (skipping retrieval for questions the model can answer from its training data).