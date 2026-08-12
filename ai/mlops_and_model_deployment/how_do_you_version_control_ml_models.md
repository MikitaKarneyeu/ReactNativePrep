Version controlling ML models involves tracking not just the model weights but also the data, code, hyperparameters, and environment used to produce them. A model is only reproducible if you can recreate it from its inputs—version control must capture the full pipeline, not just the output artifact.

Model artifacts (weights, architecture files) should be stored in a model registry with versioned tags. Tools like MLflow, DVC (Data Version Control), and cloud model registries (AWS SageMaker Model Registry, Google Vertex AI Model Registry) provide versioned storage with metadata. Each version should record: the training code version (git commit hash), the dataset version (hash or DVC reference), hyperparameters, training metrics, evaluation metrics, and the resulting model performance.

Data versioning is critical because model behavior depends on training data. DVC tracks data files alongside code in git, storing large files in remote storage (S3, GCS) while keeping lightweight pointers in git. This allows you to check out any version of the data and reproduce the model. Alternatively, use immutable data snapshots—when you train a model, record the exact data version used.

```yaml
# Example model version metadata
model_version: v2.3.1
git_commit: abc123def456
training_data: s3://bucket/data/v2024.01.15
hyperparameters:
  learning_rate: 0.001
  batch_size: 32
  epochs: 50
metrics:
  accuracy: 0.94
  f1_score: 0.92
trained_by: john@company.com
trained_at: 2024-01-20T10:30:00Z
```

Best practices include: tagging model versions semantically (major.minor.patch), maintaining a model registry as the single source of truth, linking each deployed model to its exact training run, and implementing rollback capabilities. For LLM applications, version your prompts alongside models—prompt changes can significantly affect behavior. Use immutable artifacts—never overwrite a model version, always create a new one. Implement approval workflows for promoting models from staging to production.