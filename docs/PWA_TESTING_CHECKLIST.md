# CrisisKit PWA Testing Checklist

## Overview

This checklist ensures all PWA features work correctly before deployment. Test on multiple browsers and devices for comprehensive coverage.

---

## Pre-Test Setup

### Development Environment
- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` to test production build
- [ ] Open app in incognito/private mode (clean slate)

### Testing Browsers
- [ ] Chrome/Chromium (Desktop + Android)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop + iOS)
- [ ] Edge (Desktop)

### Testing Devices
- [ ] Desktop (Windows/Mac/Linux)
- [ ] Android phone/tablet
- [ ] iOS phone/tablet (Safari only)

---

## Test 1: Service Worker Registration

### Steps
1. Open CrisisKit in browser
2. Open DevTools (F12)
3. Go to **Application** → **Service Workers**

### Expected Results
- [ ] Service worker shows status: "activated and is running"
- [ ] Service worker URL ends with `sw.js`
- [ ] No errors in console

### Alternative Check (Console)
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW Status:', reg?.active?.state); // Should be "activated"
});
```

---

## Test 2: Manifest.json Validation

### Steps
1. DevTools → **Application** → **Manifest**
2. Review manifest properties

### Expected Results
- [ ] Name: "CrisisKit - 10-Second Crisis Management"
- [ ] Short name: "CrisisKit"
- [ ] Theme color: `#dc2626` (red)
- [ ] Display: "standalone"
- [ ] Start URL: `/`
- [ ] Icons: At least one valid icon
- [ ] No manifest errors

---

## Test 3: Cache Storage

### Steps
1. DevTools → **Application** → **Cache Storage**
2. Expand cache entries

### Expected Results
- [ ] See `workbox-precache-*` cache
- [ ] See `map-tiles` cache (after viewing map)
- [ ] See `leaflet-assets` cache
- [ ] App shell files cached (index.html, .js, .css)

### Manual Test
```javascript
caches.keys().then(names => console.log('Caches:', names));
```

---

## Test 4: Offline Page Load

### Steps
1. Visit home page while online
2. DevTools → **Network** tab
3. Select "Offline" from throttling dropdown
4. Click a link to a new page (e.g., /design)

### Expected Results
- [ ] Offline fallback page loads
- [ ] Shows "You're Currently Offline" message
- [ ] Shows list of features that still work
- [ ] "Try Reconnecting" button visible

---

## Test 5: Offline Form Submission

### Critical Test - Most Important!

#### Setup
1. Create test incident (or use existing ID)
2. Open public submit form: `/#/submit/{id}`
3. Go to DevTools → **Network** tab
4. Check "Offline"

#### Steps
1. Fill out form completely:
   - Name: "Test Volunteer"
   - Contact: "+1234567890"
   - Location: "Test Location"
   - Needs: "Test needs"
2. Click "Submit Request"

#### Expected Results
- [ ] Top bar shows "Offline Mode - Submissions will be saved locally"
- [ ] Form submits without errors
- [ ] Success page shows:
  - Blue WifiOff icon (not green checkmark)
  - Title: "Saved Offline"
  - Message: "Your submission has been saved locally..."
  - Details box explaining what happens next
- [ ] Console shows: `✅ Saved to offline queue`

#### Verification
```javascript
// Check IndexedDB
const db = await Dexie.exists('CrisisKitOffline');
console.log('DB Exists:', db); // Should be true
```

---

## Test 6: Queue Count Display

### Steps
1. With offline submission from Test 5 still queued
2. Navigate back to home page or another page
3. Look for NetworkStatus component (top-right)

### Expected Results
- [ ] Red badge visible saying "Offline Mode"
- [ ] Shows "1 submission queued" (or current count)
- [ ] Badge updates in real-time

---

## Test 7: Auto-Sync on Network Restore

### Steps
1. Ensure at least 1 submission in queue (from Test 5)
2. DevTools → **Network** tab
3. Uncheck "Offline"
4. Wait 1-2 seconds

### Expected Results
- [ ] Network badge changes from red to yellow
- [ ] Shows "Syncing..." message with spinner
- [ ] Console shows: `🔄 Syncing X queued submissions...`
- [ ] After 1-3 seconds, badge turns green
- [ ] Shows "Sync Complete" with success count
- [ ] Console shows: `🎉 Sync complete: X success, 0 failed`

#### Verification
```javascript
// Queue should be empty now
offlineQueue.getCount().then(count => {
  console.log('Queue Count:', count); // Should be 0
});
```

---

## Test 8: Manual Sync

### Setup
1. Create offline submission (Test 5 steps)
2. Restore network BUT don't wait for auto-sync
3. Click "Sync Now" button immediately

### Expected Results
- [ ] "Syncing..." badge appears
- [ ] Submissions upload
- [ ] "Sync Complete" notification shows
- [ ] Queue count returns to 0

---

## Test 9: Multiple Offline Submissions

### Steps
1. Go offline (Network tab → Offline)
2. Submit 3 different forms with different data
3. Check queue count badge

### Expected Results
- [ ] Each submission shows "Saved Offline" success
- [ ] Badge shows "3 submissions queued"
- [ ] All 3 submissions visible in IndexedDB

### Verification
```javascript
offlineQueue.getAll().then(items => {
  console.log('Queue Items:', items.length); // Should be 3
  console.log('Items:', items);
});
```

### Sync Test
4. Go back online
5. Wait for auto-sync

### Expected Results
- [ ] All 3 submissions upload successfully
- [ ] "Sync Complete: 3 synced" notification
- [ ] Queue empty

---

## Test 10: Failed Sync Retry

### Setup (Requires Backend Control)
1. Add submission to queue while offline
2. Temporarily break backend (e.g., return 500 error)
3. Go online → Sync will fail

### Expected Results
- [ ] Sync completes but shows "Partial Sync"
- [ ] Badge shows "1 failed"
- [ ] Item stays in queue with `retries = 1`

### Retry Test
4. Fix backend
5. Manual sync or wait for next auto-sync

### Expected Results
- [ ] Item uploads successfully on retry
- [ ] Queue clears

---

## Test 11: Map Tile Caching

### Steps
1. Open incident dashboard with map
2. Pan around map to load tiles
3. DevTools → **Application** → **Cache Storage** → `map-tiles`
4. Verify tiles are cached
5. Go offline (Network tab)
6. Pan to previously viewed area

### Expected Results
- [ ] Map tiles visible in cache storage
- [ ] Cached tiles load instantly while offline
- [ ] Non-cached areas show gray tiles (expected)

---

## Test 12: PWA Installation (Desktop)

### Chrome/Edge (Desktop)
1. Open CrisisKit
2. Look in address bar for install icon (⊕)
3. Click icon → Install

### Expected Results
- [ ] Install prompt appears
- [ ] After install, app opens in standalone window
- [ ] No browser UI (address bar, tabs)
- [ ] App icon in taskbar/dock
- [ ] App in system app list

### Safari (macOS)
1. Open CrisisKit in Safari
2. File → Add to Dock (or Share → Add to Dock)

### Expected Results
- [ ] App adds to Dock
- [ ] Opens in standalone window

---

## Test 13: PWA Installation (Mobile)

### Android Chrome
1. Open CrisisKit
2. Wait 3-5 seconds
3. Look for install prompt at bottom

### Expected Results
- [ ] Purple/indigo gradient prompt appears
- [ ] Shows "Install CrisisKit" message
- [ ] Lists benefits: "Works Offline", "Fast Access", "No App Store"
- [ ] "Install Now" button visible

#### Install Test
4. Click "Install Now"
5. Confirm installation

### Expected Results
- [ ] App adds to home screen
- [ ] App icon visible
- [ ] Tap icon → Opens in standalone mode
- [ ] Splash screen shows briefly

### iOS Safari
1. Open CrisisKit
2. Wait 5 seconds
3. Prompt shows with iOS instructions

### Expected Results
- [ ] Prompt shows iOS-specific instructions:
  1. Tap the Share button
  2. Scroll down and tap "Add to Home Screen"
  3. Tap "Add" in the top right
- [ ] Instructions are clear

#### Manual Install
4. Tap Share button (box with arrow)
5. Scroll to "Add to Home Screen"
6. Tap "Add"

### Expected Results
- [ ] App adds to home screen
- [ ] Icon looks good
- [ ] Tap icon → Opens fullscreen (no Safari UI)

---

## Test 14: Install Prompt Dismissal

### Steps
1. Open CrisisKit (fresh session)
2. Wait for install prompt
3. Click X to dismiss
4. Refresh page

### Expected Results
- [ ] Prompt does not reappear immediately
- [ ] Prompt reappears after 7 days (check localStorage)

### Verification
```javascript
const dismissed = localStorage.getItem('crisiskit-pwa-dismissed');
console.log('Dismissed:', new Date(parseInt(dismissed)));
```

---

## Test 15: Network Status Indicator

### Scenarios to Test

#### A. Fresh Online Load
- [ ] No badge visible (expected)

#### B. Go Offline
- [ ] Top bar shows "Offline Mode - Submissions will be saved locally"

#### C. Submit Offline
- [ ] Badge shows in top-right: "Offline Mode - X submissions queued"

#### D. Come Online (with queue)
- [ ] Badge changes to blue: "Online - X items pending"
- [ ] "Sync Now" button visible

#### E. Syncing
- [ ] Badge yellow with spinner: "Syncing..."

#### F. Sync Complete
- [ ] Badge green: "Sync Complete - X synced"

---

## Test 16: Lighthouse PWA Audit

### Steps
1. Open CrisisKit in Chrome
2. DevTools → **Lighthouse** tab
3. Select:
   - Categories: Progressive Web App ✓
   - Device: Mobile
   - Mode: Navigation
4. Click "Analyze page load"

### Expected Results
- [ ] PWA score: **90+** (ideally 100)
- [ ] All PWA checks pass:
  - ✅ Installable manifest
  - ✅ Service worker
  - ✅ Works offline
  - ✅ Configured for a custom splash screen
  - ✅ Sets a theme color
  - ✅ Content sized correctly for viewport
  - ✅ Provides a valid apple-touch-icon

### Performance Targets
- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Time to Interactive (TTI): < 3.8s
- [ ] Speed Index: < 3.4s

---

## Test 17: Offline Persistence

### Steps
1. Create offline submission
2. Close browser completely
3. Reopen browser
4. Navigate to CrisisKit

### Expected Results
- [ ] Badge shows queued item count
- [ ] Queue data persists
- [ ] Auto-sync triggers if online

---

## Test 18: Image Upload (Offline)

### Steps
1. Go offline
2. Fill form and add 2-3 images
3. Submit form

### Expected Results
- [ ] Form submits successfully
- [ ] "Saved Offline" confirmation
- [ ] Images included in queue (Base64 encoded)

### Sync Test
4. Go online
5. Wait for sync

### Expected Results
- [ ] Images upload successfully with form data
- [ ] No errors in console
- [ ] Dashboard shows submission with images

---

## Test 19: Duplicate Submission Warning

### Steps
1. Online: Submit form with contact "+1234567890"
2. Immediately submit again with same contact
3. Check for warning

### Expected Results
- [ ] Warning appears: "Possible Duplicate Submission"
- [ ] Shows time of previous submission
- [ ] Requires second click to confirm

### Offline Test
4. Go offline
5. Submit with same contact

### Expected Results
- [ ] No duplicate check (expected - can't check while offline)
- [ ] Saves to queue directly

---

## Test 20: Cross-Browser Compatibility

### Test Matrix

| Test | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Service Worker registers | [ ] | [ ] | [ ] | [ ] |
| Offline submissions work | [ ] | [ ] | [ ] | [ ] |
| Auto-sync works | [ ] | [ ] | [ ] | [ ] |
| PWA installable | [ ] | [ ] | [ ] | [ ] |
| Map tiles cache | [ ] | [ ] | [ ] | [ ] |
| IndexedDB queue works | [ ] | [ ] | [ ] | [ ] |

---

## Test 21: Edge Cases

### A. Queue Full (Storage Quota)
**Steps**: Try to add 100+ large submissions with images
**Expected**: Eventually hits quota, shows error message

### B. Max Retries Reached
**Steps**: Fail sync 3 times (requires backend manipulation)
**Expected**: Item stops auto-retrying, remains in queue

### C. Rapid Online/Offline Switching
**Steps**: Toggle offline mode 10 times quickly
**Expected**: No crashes, last state wins

### D. Submit While Syncing
**Steps**: While auto-sync in progress, submit new form
**Expected**: New submission waits or queues, no conflict

---

## Test 22: Performance Under Load

### Steps
1. Add 20 submissions to queue (offline)
2. Go online
3. Measure sync time

### Expected Results
- [ ] All 20 sync successfully
- [ ] Total sync time: < 30 seconds (network-dependent)
- [ ] UI remains responsive during sync
- [ ] Progress visible (syncing badge)

---

## Bug Reporting Template

When a test fails, use this format:

```
### Bug: [Short Description]

**Test**: [Test Number and Name]
**Browser**: [Chrome 119, Safari 17, etc.]
**Device**: [Desktop/Mobile, OS version]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots**:
[Attach if helpful]

**Console Errors**:
```
[Paste any errors]
```

**IndexedDB State**:
```javascript
// Output of offlineQueue.exportQueue()
```
```

---

## Deployment Readiness

All tests must pass before production deployment:

### Critical Tests (Must Pass)
- [ ] Test 5: Offline form submission
- [ ] Test 7: Auto-sync on network restore
- [ ] Test 9: Multiple offline submissions
- [ ] Test 16: Lighthouse PWA score 90+

### Important Tests (Should Pass)
- [ ] Test 1: Service Worker registration
- [ ] Test 2: Manifest validation
- [ ] Test 11: Map tile caching
- [ ] Test 13: Mobile installation

### Nice-to-Have Tests (Can Defer)
- [ ] Test 18: Image upload offline
- [ ] Test 22: Performance under load

---

## Post-Deployment Monitoring

After deploying to production:

1. **Day 1**: Test all critical flows on live site
2. **Day 3**: Check analytics for PWA install rate
3. **Week 1**: Monitor sync error rates (if logging enabled)
4. **Week 2**: Survey users on offline experience

### Metrics to Track
- PWA install rate (% of visitors)
- Offline submissions per day
- Sync success rate (% of items)
- Average sync time

---

## Rollback Plan

If critical bugs found in production:

1. **Immediate**: Disable Service Worker
   ```javascript
   // In sw.js
   self.addEventListener('install', () => self.skipWaiting());
   self.addEventListener('activate', () => {
     return self.clients.claim().then(() => {
       return self.registration.unregister();
     });
   });
   ```

2. **Short-term**: Revert to previous version without PWA

3. **Long-term**: Fix bugs, re-test, re-deploy

---

## Test Completion Sign-Off

**Tester Name**: _________________
**Test Date**: ___________________
**Build Version**: _______________

**Overall Result**: ☐ PASS ☐ FAIL

**Critical Bugs Found**: _________
**Non-Critical Bugs**: __________

**Approved for Production**: ☐ YES ☐ NO

**Notes**:
_________________________________
_________________________________
_________________________________

---

**Ready to deploy? Go change lives during disasters! 🚀**
