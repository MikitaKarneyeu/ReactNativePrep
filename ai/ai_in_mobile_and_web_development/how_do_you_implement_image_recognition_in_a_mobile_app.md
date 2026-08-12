Implementing image recognition in a mobile app involves capturing an image (from camera or gallery), preprocessing it, running it through a trained model, and displaying the results. The approach depends on whether you're using on-device inference or a cloud API.

For on-device inference, use a pre-trained model converted to Core ML or TFLite format. A common approach is transfer learning—take a pre-trained model like MobileNet or EfficientNet-Lite and fine-tune it on your specific classes. This requires only a few hundred labeled images per class. Convert the model to the target format and integrate it into the app.

```swift
// iOS with Core ML and Vision
import Vision
import CoreML

func classifyImage(_ image: UIImage) {
    guard let cgImage = image.cgImage else { return }
    
    let request = VNCoreMLRequest(model: try! VNCoreMLModel(
        for: MobileNetV2().model
    )) { request, error in
        guard let results = request.results as? [VNClassificationObservation] else { return }
        let topResult = results.first!
        print("Class: \(topResult.identifier), Confidence: \(topResult.confidence)")
    }
    
    let handler = VNImageRequestHandler(cgImage: cgImage)
    try? handler.perform([request])
}
```

For real-time camera recognition, process video frames from AVCaptureSession (iOS) or CameraX (Android). Run inference on each frame or every Nth frame to balance accuracy and performance. Display bounding boxes or labels overlaid on the camera preview. Optimize for performance: use the smallest model that meets accuracy requirements, resize images to the model's expected input size, and batch processing where possible.

Cloud-based recognition (Google Cloud Vision, AWS Rekognition, Azure Computer Vision) is simpler to implement—send the image via API and receive results. This is better for complex tasks (OCR, facial analysis, content moderation) but requires network connectivity and adds latency. In practice, hybrid approaches work well: use on-device models for real-time features (camera preview) and cloud APIs for detailed analysis when the user takes a photo.