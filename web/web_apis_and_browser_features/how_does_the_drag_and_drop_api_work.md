The Drag and Drop API enables elements to be dragged and dropped within and between web pages. It provides a set of events and a data transfer mechanism that allows you to build interactive drag-and-drop interfaces.

**Making an element draggable:**

```html
<div draggable="true" id="draggable" class="draggable-item">
  Drag me!
</div>

<div id="dropzone" class="dropzone">
  Drop here
</div>
```

**Drag events — on the drag source:**

```javascript
const draggable = document.getElementById('draggable');

// Fired when the user starts dragging
draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id); // Set drag data
  e.dataTransfer.effectAllowed = 'move';              // Cursor effect
  e.target.classList.add('dragging');
});

// Fired continuously while dragging
draggable.addEventListener('drag', (e) => {
  // Usually not needed — use dragover on drop zones instead
});

// Fired when drag ends (drop or cancel)
draggable.addEventListener('dragend', (e) => {
  e.target.classList.remove('dragging');
});
```

**Drop events — on the drop target:**

```javascript
const dropzone = document.getElementById('dropzone');

// Fired when a dragged element enters the drop zone
dropzone.addEventListener('dragenter', (e) => {
  e.preventDefault(); // Required to allow dropping
  dropzone.classList.add('drag-over');
});

// Fired continuously while a dragged element is over the drop zone
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // REQUIRED — without this, drop is not allowed
  e.dataTransfer.dropEffect = 'move'; // Cursor feedback
});

// Fired when a dragged element leaves the drop zone
dropzone.addEventListener('dragleave', (e) => {
  dropzone.classList.remove('drag-over');
});

// Fired when an element is dropped
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');

  const id = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);
  dropzone.appendChild(element);
});
```

**The `DataTransfer` object:**

```javascript
// Set data (only works in dragstart)
e.dataTransfer.setData('text/plain', 'some text');
e.dataTransfer.setData('application/json', JSON.stringify({ id: 1 }));

// Get data (only works in drop)
const text = e.dataTransfer.getData('text/plain');
const json = JSON.parse(e.dataTransfer.getData('application/json'));

// Set drag image
e.dataTransfer.setDragCustomImage(customImage, offsetX, offsetY);

// Effects
e.dataTransfer.effectAllowed = 'copyMove'; // What the source allows
e.dataTransfer.dropEffect = 'copy';        // What the target shows
// Values: 'none', 'copy', 'move', 'link'
```

**File drag and drop (from desktop):**

```javascript
const dropzone = document.getElementById('file-dropzone');

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;

  Array.from(files).forEach(file => {
    console.log(`Name: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    // Read file
    const reader = new FileReader();
    reader.onload = (event) => {
      // Process file content
      console.log(event.target.result);
    };
    reader.readAsText(file); // or readAsDataURL, readAsArrayBuffer
  });
});
```

**Sorting list items with drag and drop:**

```javascript
const list = document.querySelector('.sortable-list');
let draggedItem = null;

list.addEventListener('dragstart', (e) => {
  draggedItem = e.target.closest('li');
  setTimeout(() => draggedItem.classList.add('dragging'), 0);
});

list.addEventListener('dragend', (e) => {
  draggedItem.classList.remove('dragging');
  draggedItem = null;
});

list.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(list, e.clientY);
  if (afterElement) {
    list.insertBefore(draggedItem, afterElement);
  } else {
    list.appendChild(draggedItem);
  }
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll('li:not(.dragging)')];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
```

**Key points:**

- `dragover` must call `e.preventDefault()` to allow drops — without it, the browser's default behavior blocks the drop
- `dragenter` should also call `e.preventDefault()` to prevent default behavior in some browsers
- `dataTransfer.setData/getData` is the primary way to pass data between drag source and drop target
- Files from the desktop are available via `e.dataTransfer.files` in the `drop` event
- The `dragover` event fires continuously — avoid expensive operations in its handler
- Touch devices have limited native drag-and-drop support — consider polyfills or touch event handling
