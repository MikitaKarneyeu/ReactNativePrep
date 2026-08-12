The Geolocation API allows web applications to access the user's geographic location (with their permission). It provides methods to get the current position and watch for position changes over time.

**Getting the current position:**

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success callback
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`Lat: ${latitude}, Lon: ${longitude}`);
    console.log(`Accuracy: ${accuracy} meters`);

    // Additional properties
    position.coords.altitude;        // Meters above sea level (may be null)
    position.coords.altitudeAccuracy; // Altitude accuracy in meters
    position.coords.heading;          // Direction in degrees (if moving)
    position.coords.speed;            // Meters per second (if moving)
    position.timestamp;               // When position was acquired
  },
  (error) => {
    // Error callback
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied location permission');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location information unavailable');
        break;
      case error.TIMEOUT:
        console.error('Location request timed out');
        break;
    }
  },
  {
    enableHighAccuracy: true,  // Use GPS if available (slower but more precise)
    timeout: 10000,            // Max time (ms) to wait for position
    maximumAge: 300000         // Accept cached position up to 5 minutes old
  }
);
```

**Watching position changes:**

```javascript
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    updateMapMarker(latitude, longitude);
  },
  (error) => {
    handleError(error);
  },
  { enableHighAccuracy: true }
);

// Stop watching
navigator.geolocation.clearWatch(watchId);
```

**Important notes:**

- **User permission required** — The browser shows a permission prompt on first use. The user can deny access.
- **HTTPS required** — Most browsers require a secure context (HTTPS) to access geolocation. Localhost is exempt.
- **Accuracy varies** — WiFi-based location is ~100m accurate, GPS is ~10m. The `enableHighAccuracy` option requests GPS but takes longer and uses more battery.
- **Privacy concerns** — Always explain why you need location and provide a clear UI for permission requests.

**Using with async/await (wrapped):**

```javascript
function getPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function showLocation() {
  try {
    const position = await getPosition({ enableHighAccuracy: true });
    const { latitude, longitude } = position.coords;
    console.log(`Location: ${latitude}, ${longitude}`);
  } catch (error) {
    console.error('Geolocation error:', error.message);
  }
}
```

**Common use cases:**

- Maps and navigation apps
- Location-based search (restaurants, stores nearby)
- Weather apps showing local conditions
- Delivery tracking
- Check-in / geotagging features
- Distance calculations between points

**Fallback strategies:**

1. IP-based geolocation (less accurate, ~city level)
2. Ask the user to enter their location manually
3. Use a geocoding service to convert addresses to coordinates
4. Show a message explaining why location is needed and how to enable it

**Browser support:** The Geolocation API is supported in all modern browsers. Mobile browsers generally provide more accurate results due to GPS hardware.
