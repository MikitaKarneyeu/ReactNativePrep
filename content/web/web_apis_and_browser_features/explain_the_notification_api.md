The Notification API allows web applications to display system-level notifications to the user, even when the page is not focused or is in the background. These are the same notifications that appear in the operating system's notification center.

**Requesting permission:**

```javascript
// Check current permission status
Notification.permission; // "granted", "denied", or "default"

// Request permission (must be called from a user gesture)
async function requestNotificationPermission() {
  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
```

**Creating notifications:**

```javascript
// Simple notification
const notification = new Notification('Hello!', {
  body: 'This is a notification message.',
  icon: '/images/icon-192.png',
  badge: '/images/badge.png',
  image: '/images/hero.jpg',
  tag: 'message-1',      // Grouping — replaces notifications with same tag
  silent: false,          // Play system sound
  requireInteraction: true, // Don't auto-dismiss
  timestamp: Date.now(),
  data: { url: '/messages/1' } // Custom data
});

// Notification events
notification.onshow = () => console.log('Notification shown');
notification.onclick = () => {
  console.log('Notification clicked');
  window.focus(); // Bring the page to front
  notification.close();
};
notification.onclose = () => console.log('Notification closed');
notification.onerror = (e) => console.error('Notification error:', e);

// Close programmatically
notification.close();
```

**Permission states:**

- `default` — User hasn't decided yet; the prompt hasn't been shown
- `granted` — User allowed notifications
- `denied` — User blocked notifications; you cannot show notifications or re-request

**Important constraints:**

- Permission must be requested from a user gesture (click, keypress) — browsers block automatic permission requests
- Once denied, the user must manually re-enable notifications in browser settings
- The page must be served over HTTPS (or localhost)
- On mobile, notifications may require additional setup (service workers for push)

**Using with Service Workers for persistent notifications:**

```javascript
// Service worker-based notifications survive page close
const registration = await navigator.serviceWorker.ready;

registration.showNotification('Push Message', {
  body: 'You have a new message',
  icon: '/icon.png',
  actions: [
    { action: 'open', title: 'Open' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
});

// Handle notification clicks in the service worker
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(clients.openWindow('/messages'));
  }
});
```

**Best practices:**

1. **Ask at the right time** — Don't request permission immediately on page load. Wait until the user understands the value (e.g., after they enable a feature that needs notifications).
2. **Provide context** — Explain why you need notifications before triggering the permission prompt.
3. **Use `tag` for grouping** — Update existing notifications instead of creating duplicates.
4. **Handle clicks** — Always implement `onclick` to take the user to relevant content.
5. **Check support** — Not all environments support notifications.
6. **Respect denial** — If the user denies permission, don't keep asking.

```javascript
// Graceful detection
if ('Notification' in window) {
  // Notifications supported
  if (Notification.permission === 'granted') {
    showNotification();
  }
} else {
  // Fall back to in-app notifications
  showInAppNotification();
}
```

**Common use cases:**

- Chat/messaging applications
- Email notifications
- Task reminders and calendar events
- Real-time updates (stock prices, sports scores)
- Build/CI status updates
- E-commerce order status changes
