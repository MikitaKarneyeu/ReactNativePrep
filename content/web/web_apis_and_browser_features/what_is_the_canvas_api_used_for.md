The Canvas API provides a JavaScript interface for drawing 2D graphics on an HTML `<canvas>` element. It offers a pixel-based drawing surface for rendering graphics, animations, visualizations, image manipulation, and games.

**Setting up a canvas:**

```html
<canvas id="myCanvas" width="800" height="600"></canvas>
```

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// The canvas has a fixed coordinate system
// (0,0) is top-left, (width, height) is bottom-right
```

**Drawing basic shapes:**

```javascript
// Rectangle
ctx.fillStyle = '#3498db';
ctx.fillRect(10, 10, 150, 100); // x, y, width, height

ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 2;
ctx.strokeRect(170, 10, 150, 100);

ctx.clearRect(10, 10, 50, 50); // Clear a rectangle

// Paths (lines, curves)
ctx.beginPath();
ctx.moveTo(50, 50);        // Move pen to position
ctx.lineTo(200, 50);       // Draw line to position
ctx.lineTo(200, 150);
ctx.closePath();            // Close the path (line back to start)
ctx.fillStyle = 'rgba(46, 204, 113, 0.5)';
ctx.fill();
ctx.strokeStyle = '#2ecc71';
ctx.stroke();

// Circle / Arc
ctx.beginPath();
ctx.arc(300, 100, 50, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
ctx.fillStyle = '#9b59b6';
ctx.fill();

// Text
ctx.font = '24px Arial';
ctx.fillStyle = '#333';
ctx.textAlign = 'center';
ctx.fillText('Hello Canvas', 400, 100);
ctx.strokeText('Stroked Text', 400, 140);
```

**Transformations:**

```javascript
// Save and restore state (transformations, styles, clipping)
ctx.save();
ctx.restore();

// Translate
ctx.translate(100, 100); // Move origin

// Rotate (in radians)
ctx.rotate(Math.PI / 4); // 45 degrees

// Scale
ctx.scale(2, 2); // Double size

// Transform matrix
ctx.transform(a, b, c, d, e, f);
```

**Images and manipulation:**

```javascript
const img = new Image();
img.src = 'photo.jpg';
img.onload = () => {
  ctx.drawImage(img, 0, 0);                    // Draw at original size
  ctx.drawImage(img, 0, 0, 200, 150);          // Resize to 200x150
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); // Crop and resize
};

// Get pixel data for manipulation
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const pixels = imageData.data; // Uint8ClampedArray [r,g,b,a, r,g,b,a, ...]

// Grayscale filter
for (let i = 0; i < pixels.length; i += 4) {
  const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
  pixels[i] = avg;     // R
  pixels[i + 1] = avg; // G
  pixels[i + 2] = avg; // B
  // pixels[i + 3] is alpha
}
ctx.putImageData(imageData, 0, 0);
```

**Animation:**

```javascript
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update positions
  x += dx;
  y += dy;

  // Draw
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(animate);
}

animate();
```

**Common use cases:**

1. **Data visualizations** — Charts, graphs, heatmaps (though libraries like D3.js or Chart.js are often preferred)
2. **Games** — 2D game rendering, sprites, tile maps
3. **Image editing** — Filters, cropping, watermarking, compositing
4. **Generative art** — Algorithmic and procedural graphics
5. **PDF generation** — Rendering documents and reports
6. **Video processing** — Frame-by-frame analysis and manipulation
7. **Interactive drawing** — Whiteboards, signature pads, annotation tools

**Canvas vs SVG:**

| Aspect | Canvas | SVG |
|--------|--------|-----|
| Rendering | Pixel-based (raster) | Vector-based (DOM) |
| Scalability | Loses quality when scaled | Scales without quality loss |
| Performance | Better for many objects | Better for few, interactive objects |
| Animation | Manual (requestAnimationFrame) | CSS/SMIL animations |
| Interaction | Manual hit detection | DOM events on elements |
| Accessibility | Limited (needs ARIA) | Inherent (DOM elements) |

The Canvas API is complemented by WebGL for 3D graphics, which uses the same `<canvas>` element but provides a `webgl` or `webgl2` context.
