Real-time image processing in mobile apps processes camera frames as they're captured, applying ML inference at 15-30+ FPS. This enables features like live camera filters, real-time object detection, AR overlays, and instant text recognition. The key challenges are achieving sufficient frame rate while maintaining accuracy, managing battery consumption, and handling the camera pipeline efficiently.

The camera pipeline captures frames from the device camera and processes them in real-time. On iOS, use AVCaptureSession with AVCaptureVideoDataOutput to receive camera frames. On Android, use CameraX with ImageAnalysis. Each frame is passed to the ML model for inference, and results are rendered as an overlay on the camera preview.

```swift
// iOS real-time camera processing
func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, 
                   from connection: AVCaptureConnection) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    
    // Run inference on the current frame
    let request = VNCoreMLRequest(model: visionModel) { request, error in
        guard let results = request.results as? [VNClassificationObservation] else { return }
        DispatchQueue.main.async {
            self.updateOverlay(with: results)  // Update UI with results
        }
    }
    
    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer)
    try? handler.perform([request])
}
```

Performance optimization is critical. Process every Nth frame (e.g., every 3rd frame) rather than every frame to reduce computational load while maintaining perceived smoothness. Downscale frames before inference—the model may not need full resolution input. Use the device's Neural Engine or GPU for inference via Core ML or TFLite delegates. Batch inference where possible—some frameworks can process multiple frames efficiently.

For AR features, combine ML inference with rendering frameworks (ARKit on iOS, ARCore on Android). Object detection results position virtual objects in the scene. Pose estimation enables body tracking for fitness apps or AR effects. Segmentation models separate foreground from background for portrait effects or background replacement.

Battery and thermal management require adaptive processing. Reduce inference frequency when the device is hot or battery is low. Pause processing when the app is backgrounded or the screen is off. Use efficient models—MobileNet, EfficientNet-Lite, or YOLOv8-nano optimized for mobile. Monitor frame rate and adjust quality dynamically—if frames are dropping, switch to a smaller model or reduce processing frequency. In practice, target 15-24 FPS for a smooth experience—30 FPS is ideal but often unnecessary for most applications.