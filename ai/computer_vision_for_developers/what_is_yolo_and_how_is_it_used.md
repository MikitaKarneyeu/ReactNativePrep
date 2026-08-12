YOLO (You Only Look Once) is a family of real-time object detection models that process the entire image in a single forward pass, making them significantly faster than two-stage detectors. YOLO divides the image into a grid and simultaneously predicts bounding boxes and class probabilities for all grid cells, achieving real-time detection at 30-60+ FPS on modern hardware.

The architecture has evolved through multiple versions. YOLOv1 introduced the single-pass concept. YOLOv3 added multi-scale detection for better small object detection. YOLOv5/YOLOv8 (by Ultralytics) improved accuracy and usability with a PyTorch implementation. YOLOv8 is currently the most popular version, offering state-of-the-art accuracy with real-time speed. YOLO-NAS and YOLOv9 continue to push accuracy boundaries.

YOLO is used wherever real-time object detection is needed. Autonomous driving detects pedestrians, vehicles, traffic signs, and lane markings in real-time. Surveillance systems detect people, vehicles, and suspicious activities. Retail applications analyze shelf inventory, detect shoplifting, and enable checkout-free stores. Industrial inspection detects defects in manufacturing. Medical imaging detects anomalies in X-rays and scans. Mobile applications use YOLO for real-time camera features—AR overlays, visual search, and accessibility tools.

Implementation is straightforward with the Ultralytics library:

```python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')  # Load pre-trained model
results = model('image.jpg')  # Run detection

for detection in results[0].boxes:
    class_name = model.names[int(detection.cls)]
    confidence = detection.conf
    bbox = detection.xyxy  # [x1, y1, x2, y2]
    print(f"{class_name}: {confidence:.2f} at {bbox}")
```

Fine-tuning YOLO on custom datasets is common for specialized applications. Collect and label images with bounding boxes (using tools like LabelImg or Roboflow), then fine-tune a pre-trained YOLO model on your data. This enables detecting custom objects—specific products, equipment, or anomalies. YOLO models are available in different sizes (nano, small, medium, large, extra-large) trading accuracy for speed. For mobile deployment, use YOLOv8n (nano) optimized with ONNX or TensorRT. For server-side applications where accuracy matters more, use YOLOv8x (extra-large).