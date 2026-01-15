# 🧪 TofuLog Manual Testing Guide

This guide will help you manually test all features before publishing to NPM.

## Prerequisites

1. Have the example app running in Expo Go
2. Open Metro terminal to see console output
3. Have the TofuLog overlay accessible (shake device or tap FAB)

---

## 📋 Test 1: Logs Tab

### Basic Logging
1. Open the app and tap the **🪐 Saturn FAB** or shake device
2. Navigate to the **Logs** tab
3. In the TestBench, press these buttons:
   - **📝 Log** - Should appear in overlay only (not Metro terminal)
   - **ℹ️ Info** - Should appear in overlay only
   - **⚠️ Warning** - Should appear in BOTH overlay AND Metro terminal
   - **❌ Error** - Should appear in BOTH overlay AND Metro terminal

**Expected Results:**
- ✅ Metro terminal shows only warnings/errors (clean!)
- ✅ Overlay shows ALL logs (complete history)
- ✅ Logs have terminal-style UI with kaomojis
- ✅ Teal color accents throughout

### Search & Filter
1. Press **🔄 Spam 20 Logs** button
2. In the search box, type "Spam log #5"
3. Verify only matching logs appear
4. Clear search
5. Tap filter buttons (ALL, LOG, INFO, WARN, ERROR)
6. Verify filtering works correctly

**Expected Results:**
- ✅ Search filters logs in real-time
- ✅ Filter buttons show log counts (e.g., "WARN 2")
- ✅ Active filter has colored background
- ✅ Filter buttons are centered vertically

### Copy & Push to Terminal
1. Long-press any log item
2. Verify log is copied to clipboard
3. Tap the **terminal icon button** (🖥️) on any log
4. Check Metro terminal - that log should appear immediately

**Expected Results:**
- ✅ Long-press copies log to clipboard
- ✅ Push to Terminal button sends log to Metro with Vibe styling
- ✅ Works for any log (even old ones)

### Clear Logs
1. Tap the **trash icon** in the search bar
2. Verify all logs are cleared

**Expected Results:**
- ✅ All logs removed from overlay
- ✅ Filter counts reset to 0

---

## 🌐 Test 2: Network Tab

### Capture Network Requests
1. Navigate to the **Network** tab
2. Add this code to your app (or use a test button):

```javascript
// Simple GET request
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(res => res.json())
  .then(data => console.log('Fetched:', data));

// POST request with body
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Test', body: 'Testing TofuLog' })
})
  .then(res => res.json())
  .then(data => console.log('Posted:', data));
```

3. Verify requests appear in the Network tab
4. Tap a request to see details

**Expected Results:**
- ✅ Requests appear with method, URL, status, and timing
- ✅ Request details show headers, body, response
- ✅ Status codes are color-coded (green for 2xx, red for errors)

### Copy as cURL
1. Open a request detail modal
2. Tap **Copy as cURL** button
3. Paste into terminal and verify it's a valid cURL command

**Expected Results:**
- ✅ cURL command is copied to clipboard
- ✅ Command includes method, URL, headers, and body
- ✅ Can be run in terminal to replay the request

### Clear Network Requests
1. Tap the **trash icon** in the Network tab
2. Verify all requests are cleared

**Expected Results:**
- ✅ All network requests removed

---

## 💥 Test 3: Crashes Tab

### Trigger a Crash
1. Navigate to the **Crashes** tab (should be empty)
2. Go back to the TestBench
3. Press **🐛 TypeError** button (this catches the error)
4. To test the error boundary, temporarily modify TestBench:

```typescript
// In TestBench.tsx, change triggerTypeError to NOT catch:
const triggerTypeError = () => {
  const obj: any = null;
  obj.someMethod(); // This will crash and be caught by error boundary
};
```

5. Press the button again
6. Navigate to Crashes tab

**Expected Results:**
- ✅ Crash appears in Crashes tab
- ✅ Shows error name, message, and timestamp
- ✅ Tap crash to see full stack trace and component stack

### Copy for AI & Share
1. Open a crash detail modal
2. Tap **Copy for AI** button
3. Paste into a text editor - verify it's formatted for AI debugging
4. Tap **Share** button
5. Verify system share dialog appears

**Expected Results:**
- ✅ Copy for AI creates markdown-formatted error report
- ✅ Share button opens system share sheet
- ✅ Can share via Messages, Email, etc.

### Clear Crashes
1. Tap the **trash icon** in the Crashes tab
2. Verify all crashes are cleared

**Expected Results:**
- ✅ All crash reports removed

---

## 📱 Test 4: Device Tab

### View Device Info
1. Navigate to the **Device** tab
2. Verify all information displays correctly

**Expected Results:**
- ✅ Device model name (e.g., "iPhone 14 Pro")
- ✅ OS name and version (e.g., "iOS 17.0")
- ✅ App name and version
- ✅ Device type (phone/tablet)
- ✅ Memory information (if available)
- ✅ Expo SDK version
- ✅ React Native version

---

## 🪐 Test 5: FAB & Shake Gesture

### Floating Action Button
1. Locate the **🪐 Saturn FAB** on screen
2. Drag it to different positions
3. Verify it snaps to edges when released
4. Tap it to open/close overlay

**Expected Results:**
- ✅ FAB is draggable
- ✅ FAB has teal background with off-white Saturn icon
- ✅ FAB has shadow/elevation
- ✅ Tapping toggles overlay

### Shake Gesture
1. Close the overlay
2. Shake your device
3. Verify overlay opens
4. Shake again
5. Verify overlay closes

**Expected Results:**
- ✅ Shake gesture toggles overlay
- ✅ Works reliably (not too sensitive)

---

## 🎨 Test 6: Visual Design

### Color Scheme
Verify the Cyber-Y2K teal theme throughout:
- ✅ Saturn FAB has teal background (#3DB6B1)
- ✅ Log level badges have teal accents
- ✅ Filter buttons have teal borders when active
- ✅ Terminal icon buttons have teal color
- ✅ Search input has teal border
- ✅ Text is off-white (#e8e8e8), not pure white

### Dark Theme
- ✅ Header is dark gray (#0d0d12)
- ✅ Background is slightly lighter (#12121a)
- ✅ Consistent dark theme throughout all tabs

### Typography
- ✅ Logs tab uses monospace font
- ✅ Kaomojis appear correctly (◕‿◕, (╯°□°)╯, etc.)
- ✅ ASCII-style badges and labels

---

## 🎯 Test 7: Terminal Log Level Filtering

### Default Behavior (warn level)
1. Open Metro terminal
2. Press these TestBench buttons:
   - **📝 Log** - Should NOT appear in Metro
   - **ℹ️ Info** - Should NOT appear in Metro
   - **⚠️ Warning** - SHOULD appear in Metro
   - **❌ Error** - SHOULD appear in Metro

**Expected Results:**
- ✅ Metro terminal is clean (only warn/error)
- ✅ All logs still captured in overlay

### Override to 'all'
1. Add to your App.js:
```javascript
import { setTerminalLogLevel } from 'tofu-log';
setTerminalLogLevel('all');
```

2. Reload app
3. Press **📝 Log** and **ℹ️ Info** buttons
4. Verify they now appear in Metro terminal

**Expected Results:**
- ✅ All log levels appear in Metro
- ✅ Still captured in overlay

---

## ✅ Final Checklist

Before publishing, verify:

- [ ] All TestBench buttons work without errors
- [ ] Logs tab shows all logs with terminal styling
- [ ] Network tab captures fetch requests
- [ ] Crashes tab captures errors
- [ ] Device tab shows device info
- [ ] FAB is draggable and has Saturn icon
- [ ] Shake gesture works
- [ ] Copy/Share features work
- [ ] Push to Terminal button works
- [ ] Teal color scheme throughout
- [ ] No console errors in Metro
- [ ] README.md is up to date
- [ ] Build succeeds (`npm run prepare`)

---

## 🐛 Common Issues

**Issue:** Logs not appearing in Metro terminal
- **Fix:** Check terminal log level with `getTerminalLogLevel()`

**Issue:** Network requests not captured
- **Fix:** Ensure you're using `fetch` or `XMLHttpRequest` (not Axios with custom adapter)

**Issue:** FAB not appearing
- **Fix:** Check `config.showFab` is not set to `false`

**Issue:** Shake gesture not working
- **Fix:** Check `config.shakeToOpen` is not set to `false`

---

## 📝 Notes

- All tests should be performed on a real device or simulator
- Test on both iOS and Android if possible
- Verify production mode disables overlay (`__DEV__ = false`)
- Check that the package builds successfully before publishing
