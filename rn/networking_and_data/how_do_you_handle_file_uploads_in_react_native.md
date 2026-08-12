File uploads in React Native involve selecting a file (image, document, video) and sending it to a server, typically using `multipart/form-data`. The process differs slightly from web due to React Native's file system.

**1. Selecting files:**

Use `react-native-image-picker` for images/videos or `react-native-document-picker` for documents:

```tsx
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

// Image picker
async function pickImage() {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
  });

  if (result.assets && result.assets.length > 0) {
    return result.assets[0]; // { uri, type, fileName, fileSize }
  }
  return null;
}

// Document picker
async function pickDocument() {
  const result = await DocumentPicker.pickSingle({
    type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
  });
  return result; // { uri, type, name, size }
}
```

**2. Uploading with fetch:**

```tsx
async function uploadFile(fileUri, fileName, fileType, endpoint) {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: fileName || 'photo.jpg',
    type: fileType || 'image/jpeg',
  });

  // Add additional fields
  formData.append('description', 'My upload');

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.json();
}

// Usage
const file = await pickImage();
if (file) {
  const result = await uploadFile(
    file.uri,
    file.fileName,
    file.type,
    'https://api.example.com/upload'
  );
}
```

**3. Uploading with Axios:**

```tsx
import axios from 'axios';

async function uploadWithAxios(file) {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.fileName,
    type: file.type,
  });

  const response = await axios.post('https://api.example.com/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload progress: ${percent}%`);
    },
  });

  return response.data;
}
```

**4. Upload with progress tracking:**

```tsx
function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.fileName,
        type: file.type,
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error('Upload failed'));
      };

      xhr.open('POST', 'https://api.example.com/upload');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
    });
  }, []);

  return { upload, progress, uploading };
}
```

**5. Multiple file upload:**

```tsx
async function uploadMultipleFiles(files) {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`files[${index}]`, {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
  });

  const response = await fetch('https://api.example.com/upload-multiple', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

**6. Image compression before upload:**

```tsx
import ImageResizer from '@bam.tech/react-native-image-resizer';

async function compressAndUpload(imageUri) {
  const resized = await ImageResizer.createResizedImage(
    imageUri,
    1024,  // maxWidth
    1024,  // maxHeight
    'JPEG',
    80,    // quality
    0,     // rotation
    undefined,
    false
  );

  return uploadFile(resized.uri, resized.name, 'image/jpeg');
}
```

**Platform considerations:**
- On iOS, `uri` starts with `file://` or `ph://` (for photos)
- On Android, `uri` may start with `content://` or `file://`
- Ensure the URI scheme is compatible with the upload library
- Request camera/photo permissions before accessing media
- Handle large files carefully to avoid memory issues

**Best practices:**
- Compress images before uploading to reduce bandwidth and time
- Show upload progress to the user
- Implement retry logic for failed uploads
- Validate file size and type on the client before uploading
- Use signed URLs or direct-to-cloud uploads (S3, Cloudinary) for large files
- Handle upload cancellation gracefully
- Show previews of selected files before uploading
