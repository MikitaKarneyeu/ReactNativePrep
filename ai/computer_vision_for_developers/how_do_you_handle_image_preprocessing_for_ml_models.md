Image preprocessing transforms raw images into a format suitable for ML models. The preprocessing pipeline typically includes resizing, normalization, color space conversion, and augmentation. Proper preprocessing is critical—models trained with specific preprocessing expect the same transformations during inference.

Resizing adapts images to the model's expected input dimensions. Most models expect fixed-size inputs (224x224 for ResNet, 640x640 for YOLO). Common strategies include: resizing with aspect ratio distortion (simple but may deform objects), resizing with padding (maintain aspect ratio, add black bars), and center cropping (resize the shorter side, then crop the center). The choice affects model accuracy—padding preserves aspect ratios but introduces irrelevant black regions.

Normalization scales pixel values to the range the model expects. Most pre-trained models expect pixels in [0, 1] or normalized with ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]). Some models expect [-1, 1] range. Always use the same normalization as the model's training—mismatched normalization significantly degrades performance.

```python
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),  # Converts to [0, 1] and changes HWC to CHW
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225]),
])
```

Data augmentation artificially increases training set diversity by applying random transformations. Common augmentations include random horizontal flips, random rotations (±15°), color jitter (brightness, contrast, saturation, hue), random crops, and Gaussian blur. Advanced augmentations include MixUp (blending two images), CutOut (masking random patches), and AutoAugment (learned augmentation policies). Augmentation is applied only during training—use the deterministic preprocessing (resize, normalize) during inference.

Preprocessing for different modalities varies. For medical images, windowing (adjusting contrast for specific tissue types) and histogram equalization are common. For satellite imagery, atmospheric correction and pan-sharpening may be needed. For video, frame sampling and temporal augmentation are used. Libraries like Albumentations provide efficient, composable augmentation pipelines optimized for speed. In production, implement preprocessing as part of the model pipeline to ensure consistency between training and inference.