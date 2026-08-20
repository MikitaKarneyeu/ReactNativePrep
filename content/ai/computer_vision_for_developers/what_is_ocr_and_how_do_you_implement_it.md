OCR (Optical Character Recognition) extracts text from images, scanned documents, photos, and screenshots. Modern OCR systems combine text detection (finding where text appears in an image) with text recognition (reading the detected text). This enables digitizing printed documents, reading signs in photos, extracting information from receipts, and making images searchable.

Cloud OCR APIs are the easiest to implement. Google Cloud Vision, AWS Textract, and Azure Computer Vision provide highly accurate OCR with minimal setup. They handle complex layouts, multiple languages, handwriting, and various document types:

```python
from google.cloud import vision

client = vision.ImageAnnotatorClient()
with open('document.jpg', 'rb') as f:
    image = vision.Image(content=f.read())

response = client.text_detection(image=image)
for text in response.text_annotations:
    print(text.description)
```

Open-source OCR tools include Tesseract (the most established, supports 100+ languages), EasyOCR (Python library supporting 80+ languages), PaddleOCR (high accuracy, especially for Chinese/English), and Surya (modern OCR with excellent layout detection). Tesseract works well for clean printed text but struggles with handwriting, low-quality images, and complex layouts.

Modern OCR uses deep learning. Text detection models (EAST, CRAFT, DBNet) locate text regions in images using segmentation or regression approaches. Text recognition models (CRNN, TrOCR, PaddleOCR's SVTR) convert detected text regions into character sequences. These are often combined in end-to-end pipelines: detect text regions → crop and preprocess each region → recognize text in each crop.

Preprocessing improves OCR accuracy significantly. Convert to grayscale, apply binarization (thresholding to black and white), correct skew and rotation, remove noise, and enhance contrast. For document images, deskewing and dewarping (correcting curved or folded pages) improve results. For mobile captures, perspective correction compensates for camera angle. In production, implement confidence scores for each detected text region—flag low-confidence results for human review. Post-processing includes spell correction, language detection, and layout reconstruction (understanding columns, tables, and reading order).