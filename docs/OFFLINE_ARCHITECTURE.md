# CrisisKit Offline Architecture

## System Overview

CrisisKit's offline capabilities are built on three core technologies:

1. **Service Worker** (Workbox) - Caching and offline page serving
2. **IndexedDB** (Dexie) - Offline submission queue
3. **Network Status API** - Online/offline detection and sync triggering

```
┌─────────────────────────────────────────────────────────────┐
│                      CrisisKit PWA                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐      ┌─────────────────┐              │
│  │  React App    │◄────►│ Service Worker  │              │
│  │  (UI Layer)   │      │  (sw.js)        │              │
│  └───────┬───────┘      └────────┬────────┘              │
│          │                       │                         │
│          │                       ▼                         │
│          │              ┌─────────────────┐               │
│          │              │  Cache Storage  │               │
│          │              │  (App Shell +   │               │
│          │              │   Map Tiles)    │               │
│          │              └─────────────────┘               │
│          │                                                 │
│          ▼                                                 │
│  ┌──────────────────┐   ┌─────────────────┐              │
│  │   IndexedDB      │◄──│ offlineQueue    │              │
│  │ (CrisisKitOffline)│  │   Service       │              │
│  └──────────────────┘   └─────────────────┘              │
│                                                             │
│  ┌──────────────────┐   ┌─────────────────┐              │
│  │  Network Status  │◄──│ navigator.onLine│              │
│  │   Hook           │   │  & Events       │              │
│  └──────────────────┘   └─────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backend Server  │
                    │  (Google Sheets  │
                    │   or Supabase)   │
                    └──────────────────┘
```

---

## Component Details

### 1. Service Worker (Workbox)

**File**: Auto-generated `dist/sw.js` by vite-plugin-pwa

**Responsibilities:**
- Intercept all network requests
- Serve cached assets when available
- Apply caching strategies based on resource type
- Serve offline fallback page

**Caching Strategies:**

#### A. App Shell - CacheFirst
```javascript
// Pattern: All static assets
globPatterns: ['**/*.{js,css,html,ico,svg,png,jpg,jpeg,woff,woff2}']

// Strategy:
1. Check cache first
2. If hit → Serve from cache
3. If miss → Fetch from network → Cache it
```

**Benefit**: Instant loading on return visits, works 100% offline

#### B. Map Tiles - CacheFirst
```javascript
// Pattern: https://*.openstreetmap.org/*
urlPattern: /^https:\/\/.*\.openstreetmap\.org.*/i

// Strategy:
1. Check cache first
2. If hit → Serve from cache
3. If miss → Fetch from network → Cache it (max 200 tiles, 30 days)
```

**Benefit**: Maps work offline for recently viewed areas

#### C. API Requests - NetworkFirst
```javascript
// Pattern: /api/*
urlPattern: /\/api\/.*/i

// Strategy:
1. Try network first (10s timeout)
2. If success → Update cache + return
3. If fail → Serve from cache
4. If no cache → offlineQueue handles it
```

**Benefit**: Always get fresh data when possible, graceful degradation

**Offline Fallback:**
```javascript
navigateFallback: 'offline.html'
navigateFallbackDenylist: [/^\/api/] // Don't fallback for API routes
```

---

### 2. IndexedDB Queue (Dexie)

**File**: `services/offlineQueue.ts`

**Database Schema:**
```typescript
Database: CrisisKitOffline
  Table: submissions
    - id (auto-increment)
    - data (IncidentResponse object)
    - timestamp (when queued)
    - retries (attempt count)
    - lastAttempt (timestamp)
    - error (last error message)
```

**Key Functions:**

#### `add(data)` - Add to Queue
```typescript
await offlineQueue.add({
  incidentId: 'abc-123',
  name: 'John Doe',
  contact: '+1234567890',
  needs: 'Medical assistance',
  location: '37.7749, -122.4194',
  images: ['data:image/jpeg;base64,...']
})
```

**Result**: Returns queue item ID

#### `syncAll(submitFn)` - Sync Queue
```typescript
const result = await offlineQueue.syncAll(async (data) => {
  return await storageService.submitResponse(data);
});

console.log(result);
// { success: 5, failed: 1, total: 6 }
```

**Logic:**
1. Get all queued items
2. For each item:
   - Check if retries < MAX_RETRIES (3)
   - Try submitting with provided function
   - If success → Remove from queue
   - If fail → Increment retries, update error
3. Return summary statistics

#### `getCount()` - Queue Size
```typescript
const pending = await offlineQueue.getCount();
// Returns: 3
```

#### `getAll()` - All Items
```typescript
const items = await offlineQueue.getAll();
// Returns: QueuedSubmission[]
```

---

### 3. Network Status Hook

**File**: `hooks/useNetworkStatus.ts`

**State Management:**
```typescript
interface NetworkStatus {
  isOnline: boolean;        // Current network state
  pendingCount: number;     // Items in queue
  isSyncing: boolean;       // Sync in progress
  lastSyncResult?: {        // Last sync summary
    success: number;
    failed: number;
    total: number;
  };
}
```

**Event Listeners:**
```typescript
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

**Auto-Sync Logic:**
```typescript
const handleOnline = async () => {
  setIsOnline(true);

  // Wait 1 second for network to stabilize
  setTimeout(async () => {
    const count = await offlineQueue.getCount();
    if (count > 0) {
      await syncNow(); // Trigger automatic sync
    }
  }, 1000);
};
```

**Manual Sync:**
```typescript
const { syncNow } = useNetworkStatus();

// User clicks "Sync Now" button
await syncNow();
```

---

## Data Flow Diagrams

### Submit Flow (Online)

```
User fills form
      ↓
Click "Submit"
      ↓
Check navigator.onLine → TRUE
      ↓
storageService.submitResponse(data)
      ↓
[Success] → Show success message
      ↓
[Failure] → Fallback to offline queue
```

### Submit Flow (Offline)

```
User fills form
      ↓
Click "Submit"
      ↓
Check navigator.onLine → FALSE
      ↓
offlineQueue.add(data)
      ↓
Show "Saved Offline" message
      ↓
Wait for network...
      ↓
[Online Event] → Auto-sync triggered
      ↓
offlineQueue.syncAll()
      ↓
Upload all items → Show sync result
```

### Sync Flow (Detailed)

```
Network restored
      ↓
online event fires
      ↓
useNetworkStatus detects
      ↓
Wait 1 second (stabilization)
      ↓
Check queue count
      ↓
If count > 0:
  ├─ Set isSyncing = true
  ├─ Get all queued items
  ├─ For each item:
  │   ├─ Check retries < 3
  │   ├─ Try submit
  │   ├─ Success → Remove from queue
  │   └─ Fail → Increment retries
  ├─ Set isSyncing = false
  └─ Display sync result notification
```

---

## Error Handling

### Network Request Failures

**Scenario 1: Online but server error (500)**
```typescript
try {
  await storageService.submitResponse(data);
} catch (error) {
  // Fallback to offline queue
  await offlineQueue.add(data);
  setSavedOffline(true);
}
```

**Result**: User sees success (saved offline), will retry later

### Quota Exceeded Errors

**Scenario 2: IndexedDB full**
```typescript
try {
  await offlineQueue.add(data);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    alert('Storage full. Please sync existing items first.');
  }
}
```

**Mitigation**: Typical storage limits are generous (GB scale)

### Sync Retry Logic

**Scenario 3: Sync fails multiple times**
```typescript
MAX_RETRIES = 3

if (item.retries >= MAX_RETRIES) {
  console.warn('Max retries reached, skipping');
  // Item stays in queue but won't be auto-retried
  // User can manually export and submit later
}
```

**Future**: Add UI to manage failed items

---

## Performance Optimizations

### 1. Lazy Queue Count Refresh
```typescript
// Only check queue count every 30 seconds
const interval = setInterval(refreshCount, 30000);
```

**Benefit**: Reduce IndexedDB queries, improve battery life

### 2. Debounced Sync
```typescript
// Wait 1 second after "online" event before syncing
setTimeout(async () => {
  await syncNow();
}, 1000);
```

**Benefit**: Avoid syncing during network flapping

### 3. Chunked Map Tile Cache
```typescript
expiration: {
  maxEntries: 200,      // Limit cache size
  maxAgeSeconds: 2592000 // 30 days
}
```

**Benefit**: Prevent cache from growing indefinitely

### 4. Network Timeout
```typescript
networkTimeoutSeconds: 10 // For API requests
```

**Benefit**: Fast fallback to cache instead of long hangs

---

## Security Considerations

### 1. Data Isolation
- IndexedDB is origin-specific (CORS protection)
- No cross-domain access to queue data
- Service Worker only handles same-origin requests

### 2. HTTPS Requirement
- Service Workers only work on HTTPS (or localhost)
- Ensures encrypted transport of queued data

### 3. No Cloud Backup
- Queue data never leaves device until synced
- Intentional design for privacy
- Trade-off: Data lost if device lost

### 4. Image Compression (Future)
```typescript
// Planned: Compress images before queuing
const compressed = await compressImage(imageData, {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920
});
```

**Benefit**: Reduce storage usage and upload time

---

## Browser Compatibility

### Service Worker Support
| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | ✅ 40+ | Full support |
| Firefox | ✅ 44+ | Full support |
| Safari | ✅ 11.1+ | Full support (iOS 11.3+) |
| Edge | ✅ 17+ | Chromium-based |

### IndexedDB Support
| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | ✅ 24+ | Full support |
| Firefox | ✅ 16+ | Full support |
| Safari | ✅ 10+ | Full support |
| Edge | ✅ 12+ | Full support |

### PWA Installation
| Platform | Support | Notes |
|----------|---------|-------|
| Android | ✅ Chrome 40+ | Native "Add to Home Screen" |
| iOS | ✅ Safari 11.3+ | Manual via Share menu |
| Windows | ✅ Chrome/Edge | App-style installation |
| macOS | ✅ Safari 14+ | Dock installation |

---

## Monitoring & Debugging

### Service Worker Status
```javascript
// Check registration
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW State:', reg?.active?.state);
  // "activated" = working
});
```

### Queue Inspection
```javascript
// Export queue for debugging
const queueData = await offlineQueue.exportQueue();
console.log(JSON.parse(queueData));
```

### Cache Inspection
```javascript
// List all caches
const cacheNames = await caches.keys();
console.log('Caches:', cacheNames);

// Inspect specific cache
const cache = await caches.open('workbox-precache-v2-...');
const entries = await cache.keys();
console.log('Cached URLs:', entries.map(e => e.url));
```

### Network Events
```javascript
// Log all network transitions
window.addEventListener('online', () => {
  console.log('🌐 Online:', new Date());
});

window.addEventListener('offline', () => {
  console.log('📡 Offline:', new Date());
});
```

---

## Deployment Checklist

### Pre-Deploy
- [ ] Run `npm run build` successfully
- [ ] Verify `dist/sw.js` exists
- [ ] Verify `dist/manifest.webmanifest` exists
- [ ] Test offline mode in Chrome DevTools
- [ ] Check Lighthouse PWA score > 90

### Deploy
- [ ] Deploy `dist/` folder to hosting
- [ ] Ensure HTTPS is enabled
- [ ] Set correct `Cache-Control` headers
- [ ] Verify Service Worker registers on production URL

### Post-Deploy
- [ ] Test installation on mobile device
- [ ] Test offline submission flow
- [ ] Test auto-sync after network restoration
- [ ] Check PWA install prompt appears

---

## Troubleshooting Common Issues

### Issue: Service Worker not updating
**Cause**: Aggressive caching of `sw.js`
**Solution**:
```nginx
# In server config
location /sw.js {
  add_header Cache-Control "no-cache";
}
```

### Issue: Offline page not showing
**Cause**: Page not in cache
**Solution**: Visit page at least once while online

### Issue: Queue not syncing
**Cause**: Event listener not firing
**Solution**: Check browser console for errors, manually trigger `syncNow()`

### Issue: Storage quota exceeded
**Cause**: Too many large images in queue
**Solution**: Implement image compression (future enhancement)

---

## Future Architecture Enhancements

### 1. Background Sync API
```typescript
// Use Background Sync for better reliability
await registration.sync.register('sync-queue');
```

**Benefit**: Sync even after user closes browser

### 2. Periodic Sync
```typescript
// Sync queue every 12 hours
await registration.periodicSync.register('periodic-queue-sync', {
  minInterval: 12 * 60 * 60 * 1000
});
```

**Benefit**: Automatic cleanup of old queue items

### 3. Push Notifications
```typescript
// Notify user when sync completes
await registration.showNotification('Sync Complete', {
  body: '5 submissions uploaded successfully',
  icon: '/icon.svg'
});
```

**Benefit**: User doesn't need to keep app open

---

## References

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Dexie.js Documentation](https://dexie.org/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Built with ❤️ for reliable crisis response**
