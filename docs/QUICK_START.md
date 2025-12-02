# CrisisKit PWA - Quick Start Guide

## For Developers

### 1. Install Dependencies
```bash
npm install
```

**New dependencies added:**
- `vite-plugin-pwa` - PWA plugin
- `dexie` - IndexedDB wrapper
- `workbox-window` - Service Worker helper
- `@supabase/supabase-js` - Type definitions

### 2. Development
```bash
npm run dev
```

**PWA features work in dev mode!**
- Service Worker: ✅ Enabled
- Offline mode: ✅ Test with DevTools
- Hot reload: ✅ Preserved

### 3. Build for Production
```bash
npm run build
```

**Output:**
- `dist/sw.js` - Service Worker
- `dist/manifest.webmanifest` - PWA manifest
- `dist/workbox-*.js` - Workbox runtime

### 4. Preview Production Build
```bash
npm run preview
```

**Test PWA features:**
- Service Worker registration
- Offline submission
- Auto-sync
- PWA installation

### 5. Type Check
```bash
npx tsc --noEmit
```

**Should show:** 0 errors ✅

---

## For Testers

### Quick Offline Test (5 minutes)

1. **Start app:**
   ```bash
   npm run preview
   ```

2. **Open in Chrome:**
   - Navigate to http://localhost:4173
   - Open DevTools (F12)

3. **Go offline:**
   - DevTools → Network tab
   - Check "Offline"

4. **Create incident and submit form:**
   - Should see "Saved Offline" message
   - Check IndexedDB: Application → IndexedDB → CrisisKitOffline

5. **Go back online:**
   - Uncheck "Offline"
   - Wait 2 seconds
   - Should see "Sync Complete"

**✅ If all steps work → PWA is functioning correctly!**

---

## For Deployment

### Pre-Deploy Checklist

- [ ] Run `npm run build` successfully
- [ ] Verify `dist/sw.js` exists
- [ ] Verify `dist/manifest.webmanifest` exists
- [ ] Test offline mode locally
- [ ] Run Lighthouse PWA audit (target: 90+)

### Deploy Steps

1. **Upload dist/ folder to hosting**
   - All files in dist/
   - Maintain folder structure

2. **Configure server headers**
   ```nginx
   # Nginx example
   location /sw.js {
     add_header Cache-Control "no-cache";
   }
   ```

3. **Ensure HTTPS**
   - Service Workers require HTTPS
   - Exception: localhost

4. **Test on production URL**
   - Service Worker registers
   - PWA install prompt appears
   - Offline mode works

### Post-Deploy Testing

1. **Desktop Chrome:**
   - Visit site
   - DevTools → Application → Service Workers
   - Should show "activated and running"

2. **Mobile Device:**
   - Visit site on phone
   - Wait for install prompt
   - Test offline submission

3. **Run Lighthouse:**
   - DevTools → Lighthouse
   - Category: Progressive Web App
   - Target: 90+ score

---

## Troubleshooting

### Service Worker not registering
**Fix:** Clear cache and hard refresh (`Ctrl+Shift+R`)

### Offline submissions not syncing
**Fix:** Check console for errors, try manual "Sync Now" button

### Install prompt not showing
**Fix:** Ensure HTTPS, check manifest in DevTools

### TypeScript errors
**Fix:** Run `npm install` again, check `vite-env.d.ts` exists

---

## Documentation

- **Feature Guide**: [`PWA_FEATURE_GUIDE.md`](./PWA_FEATURE_GUIDE.md)
- **Architecture**: [`OFFLINE_ARCHITECTURE.md`](./OFFLINE_ARCHITECTURE.md)
- **Testing**: [`PWA_TESTING_CHECKLIST.md`](./PWA_TESTING_CHECKLIST.md)
- **Summary**: [`PWA_IMPLEMENTATION_SUMMARY.md`](./PWA_IMPLEMENTATION_SUMMARY.md)

---

## Key Files

```
New Files:
├── services/offlineQueue.ts          # Queue service
├── hooks/useNetworkStatus.ts         # Network hook
├── components/pwa/NetworkStatus.tsx  # Status badge
├── components/pwa/PWAInstallPrompt.tsx # Install prompt
├── public/icon.svg                   # PWA icon
├── public/offline.html               # Offline fallback
└── vite-env.d.ts                     # Type definitions

Modified Files:
├── vite.config.ts                    # PWA config
├── App.tsx                           # PWA integration
├── pages/PublicSubmit.tsx            # Offline logic
└── package.json                      # Dependencies
```

---

## Need Help?

1. Check documentation files above
2. Review test checklist for specific issues
3. Check GitHub issues
4. Contact maintainer

---

**Ready to test? Let's go! 🚀**
