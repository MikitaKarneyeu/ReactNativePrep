Pre-trained vision models provide powerful feature extraction capabilities without training from scratch. Models like ResNet, EfficientNet, CLIP, and Vision Transformers are trained on millions of images (ImageNet, LAION) and learn general visual features—edges, textures, shapes, objects—that transfer well to many tasks.

Feature extraction uses a pre-trained model as a fixed feature extractor. Pass an image through the model (excluding the final classification layer) to get a feature vector, then use this vector for downstream tasks like similarity search, clustering, or as input to a simpler classifier. This requires no training and works immediately:

```python
import torch
from torchvision import models, transforms

model = models.resnet50(pretrained=True)
model = torch.nn.Sequential(*list(model.children())[:-1])  # Remove final layer
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

image = transform(image).unsqueeze(0)
features = model(image)  # 2048-dimensional feature vector
```

Fine-tuning adapts a pre-trained model to your specific task by replacing the final layer and training on your labeled data. This is much more effective than training from scratch—pre-trained features provide a strong starting point. Freeze early layers (which learn general features) and train later layers (which learn task-specific features). This works with as few as 100-1000 labeled images per class.

Zero-shot recognition with CLIP enables classifying images without any training. CLIP learns joint text-image representations—you can classify an image by comparing its embedding to text embeddings of class descriptions. "A photo of a cat" vs. "A photo of a dog" enables classification without task-specific training.

In practice, start with pre-trained models for any vision task. Use feature extraction for similarity search and clustering. Fine-tune for classification, detection, or segmentation on your specific data. Use CLIP for zero-shot tasks or when you can't collect labeled data. Deploy optimized versions (ONNX, TensorRT, Core ML) for production inference. The choice of backbone depends on your accuracy and speed requirements—EfficientNet-Lite for mobile, ResNet for server, ViT for highest accuracy.