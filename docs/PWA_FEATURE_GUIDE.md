# CrisisKit PWA Feature Guide

## Overview

CrisisKit is now a **Progressive Web App (PWA)** designed to work reliably during disasters when network connectivity is unreliable or unavailable. This guide explains the PWA features and how they benefit crisis response.

## Why PWA for Crisis Response?

**In disaster scenarios, network is the first thing to fail.** CrisisKit's PWA features ensure:

- ✅ **Works Offline**: Submit crisis responses even without internet
- ✅ **Auto-Sync**: Submissions automatically upload when network returns
- ✅ **Fast Loading**: Cached resources load instantly
- ✅ **Installable**: Add to home screen for quick access
- ✅ **Reliable**: No data loss during network failures

---

## Key Features

### 1. Offline Submission Queue

**What it does:**
- When offline, submissions are saved to local IndexedDB
- Each submission includes full form data, images, and metadata
- Queue status is visible in real-time

**How it works:**
1. User fills out crisis response form
2. If network is unavailable, submission goes to offline queue
3. User sees confirmation: "Saved Offline - Will sync when online"
4. When network returns, queue automatically syncs in background

**User Experience:**
```
[Offline] → Submit Form → Saved to Queue → [Online] → Auto-Upload → Success ✓
```

---

### 2. Network Status Indicator

**What it displays:**

- **Offline Mode**: Red badge at top of page
  - Shows number of pending submissions
  - Clear message: "Submissions will be saved locally"

- **Syncing**: Yellow badge with spinner
  - "Syncing... Uploading queued submissions"

- **Online with Pending Items**: Blue badge with "Sync Now" button
  - Manual trigger option for immediate sync

- **Sync Complete**: Green success badge
  - Shows success/failure counts

**Location**: Fixed position at top-right of screen (desktop) or top bar (mobile)

---

### 3. Service Worker Caching

**What gets cached:**

#### App Shell (Cache First Strategy)
- HTML, CSS, JavaScript files
- Fonts and icons
- Core UI assets
- **Result**: Instant loading, even offline

#### Map Tiles (Cache First Strategy)
- OpenStreetMap tiles
- Leaflet library assets
- **Max Cache**: 200 tiles, 30 days expiry
- **Result**: Maps work offline for recently viewed areas

#### API Requests (Network First Strategy)
- Prefer fresh data when online
- Fall back to cache if offline
- 10-second network timeout
- **Result**: Always try for latest data, graceful offline fallback

---

### 4. PWA Installation

**Supported Platforms:**
- ✅ Android (Chrome, Edge, Samsung Internet)
- ✅ iOS/iPadOS 16.4+ (Safari)
- ✅ Desktop (Chrome, Edge, macOS Safari)

**Installation Prompt:**
- Appears 3 seconds after first visit
- Non-intrusive (can be dismissed)
- Shows benefits: "Works Offline", "Fast Access", "No App Store"
- iOS users get specific instructions (Safari Share → Add to Home Screen)

**After Installation:**
- App opens in standalone mode (no browser UI)
- Custom icon on home screen
- Splash screen on launch
- Native app-like experience

---

### 5. Offline Fallback Page

**When you see it:**
- Only when navigating to a completely new page while offline
- Form pages already visited are cached and work normally

**What it shows:**
- Clear "You're Currently Offline" message
- Number of queued submissions
- List of features that still work offline
- "Try Reconnecting" button

---

## User Workflows

### Scenario 1: Normal Online Usage
1. User opens CrisisKit
2. Fills out form
3. Submits → Direct upload to server
4. Success confirmation
5. **No offline features needed**

### Scenario 2: Intermittent Network
1. User opens CrisisKit (loads from cache)
2. Starts filling form
3. Network drops mid-way
4. Top bar shows "Offline Mode"
5. User completes and submits form
6. "Saved Offline" confirmation
7. Network returns within 1 minute
8. Auto-sync uploads submission
9. User sees "Sync Complete" notification

### Scenario 3: Extended Offline Period
1. Disaster scenario - no network for hours
2. User opens CrisisKit (works from cache)
3. Submits 5 different responses
4. All saved to queue (visible count: "5 pending")
5. Hours later, network returns
6. All 5 submissions upload automatically
7. Success confirmation for each

### Scenario 4: Volunteer Coordinator
1. Coordinator installs CrisisKit as PWA
2. Pre-loads map by visiting incident dashboard
3. Goes to disaster zone (no signal)
4. Can still:
   - View cached incident details
   - See previously loaded map tiles
   - Fill out response forms
   - Queue submissions
5. Returns to base → Everything syncs

---

## Technical Details

### Storage Limits

**IndexedDB (Offline Queue):**
- **Chrome/Edge**: ~60% of available disk space
- **Firefox**: ~50% of available disk space
- **Safari**: ~1GB
- **Practical limit**: Hundreds of submissions with images

**Cache Storage (Service Worker):**
- **Chrome/Edge**: Dynamic based on available space
- **Firefox**: Up to 50% of free disk space
- **Safari**: Up to 1GB
- **Our app**: Configured for ~200 map tiles + app shell

### Data Persistence

**How long does offline data last?**
- IndexedDB queue: Persists until manually cleared or synced
- Service Worker cache: 30 days for map tiles, indefinite for app shell
- No automatic deletion of unsent submissions

**What if user closes browser?**
- Data persists across browser sessions
- Queue will sync when user reopens app and network is available

---

## Testing PWA Features

### Test Offline Mode (Chrome DevTools)
1. Open CrisisKit in Chrome
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Check "Offline" in throttling dropdown
5. Try submitting a form → Should save to queue
6. Uncheck "Offline" → Should auto-sync

### Test Service Worker
1. Open DevTools → **Application** tab
2. Click **Service Workers** in sidebar
3. Should see: "Status: activated and is running"
4. Click **Cache Storage**
5. Expand to see cached resources

### Test PWA Installation
1. On Android Chrome: Look for "Install" prompt or menu option
2. On iOS Safari: Share button → "Add to Home Screen"
3. On Desktop Chrome: Address bar install icon or menu

---

## Performance Metrics

### Lighthouse PWA Score: 90+

**Criteria Met:**
- ✅ Installable manifest
- ✅ Service worker registered
- ✅ Works offline
- ✅ Fast load times
- ✅ Responsive design
- ✅ HTTPS ready

### Load Times
- **First Load**: < 3 seconds (network-dependent)
- **Return Visit**: < 1 second (cached)
- **Offline Load**: < 500ms (instant)

---

## Troubleshooting

### "Submissions not syncing"
**Check:**
1. Is network actually restored? (Try loading another website)
2. Open DevTools → Console → Look for sync errors
3. Go to Application → IndexedDB → CrisisKitOffline → submissions
4. Manually trigger sync with "Sync Now" button

### "Service Worker not registering"
**Solutions:**
1. Ensure HTTPS (or localhost for dev)
2. Clear browser cache: DevTools → Application → Clear storage
3. Unregister old service worker: Application → Service Workers → Unregister
4. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Offline page shows instead of form"
**Cause:** First-time visit to form while offline
**Solution:** Visit form at least once while online to cache it

---

## Best Practices for Volunteers

### Before Going to Disaster Zone
1. ✅ Install CrisisKit as PWA on mobile device
2. ✅ Open the incident link once (to cache it)
3. ✅ Pan around map area (to cache tiles)
4. ✅ Ensure device has sufficient battery + power bank

### During Disaster Response
1. ✅ Don't worry about network status - just submit forms
2. ✅ Check pending count badge to track queued submissions
3. ✅ Keep device powered on until returning to base

### After Returning to Base
1. ✅ Connect to WiFi (faster upload)
2. ✅ Wait for "Sync Complete" notification
3. ✅ Verify all submissions in dashboard

---

## Privacy & Security

### What data is stored locally?
- Queued form submissions (name, contact, needs, location, images)
- Cached pages and assets
- Map tiles for viewed areas

### Is it secure?
- ✅ IndexedDB is origin-isolated (not accessible by other websites)
- ✅ No data leaves device until network is available
- ✅ Automatic sync uses same HTTPS encryption as direct submission
- ✅ Cache cleared when user clears browser data

### Can others access my queued data?
- ❌ No - data is device-specific and not shared
- ❌ No cloud backup of queue (intentional for security)
- ⚠️ If device is lost, queued data is lost (submit as soon as possible)

---

## Future Enhancements

**Planned features:**
- 🔄 Conflict resolution for duplicate submissions
- 📸 Image compression for faster sync
- 🗺️ Offline geocoding for map addresses
- 📊 Sync progress bar with individual item status
- 🔔 Push notifications when sync completes
- 💾 Export queue as backup file

---

## Support

**Questions or issues?**
- Check [GitHub Issues](https://github.com/sparksverse/crisiskit-lite/issues)
- Review [Offline Architecture](./OFFLINE_ARCHITECTURE.md) for technical details
- See [Testing Checklist](./PWA_TESTING_CHECKLIST.md) for QA

---

**CrisisKit PWA: Reliable Crisis Response, Even When Networks Fail** 🚀
