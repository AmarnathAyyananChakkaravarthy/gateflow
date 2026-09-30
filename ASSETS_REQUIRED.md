# Required Assets for Building GateFlow

Before building the app, you need to create the following asset files. The build process will use placeholder assets if these are missing, but it's better to provide proper ones.

---

## Required Asset Files

### 1. App Icon (`assets/icon.png`)
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Purpose:** Main app icon shown on home screen
- **Recommendation:** Use your college/organization logo

### 2. Adaptive Icon (`assets/adaptive-icon.png`)
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Purpose:** Android adaptive icon (supports different shapes)
- **Recommendation:** Same as icon.png, but centered in safe zone

### 3. Splash Screen (`assets/splash.png`)
- **Size:** 1284x2778 pixels (iPhone 13 Pro Max size)
- **Format:** PNG
- **Background:** #1a202c (dark blue-gray, matching app theme)
- **Purpose:** Loading screen when app launches
- **Recommendation:** App logo centered on dark background

### 4. Favicon (`assets/favicon.png`)
- **Size:** 48x48 pixels
- **Format:** PNG
- **Purpose:** Web version favicon (if used)

---

## Quick Asset Creation Options

### Option 1: Use Expo Asset Generator (Easiest)
```bash
npx expo install expo-asset
```
Then use an online tool like:
- https://easyappicon.com/
- https://appicon.co/

Upload a 1024x1024 logo, and it generates all required sizes.

### Option 2: Create Manually with Design Tools

**Using Canva (Free):**
1. Go to https://www.canva.com/
2. Create custom size: 1024x1024
3. Design your app icon
4. Download as PNG
5. Save to `assets/icon.png`

**Using Figma (Free):**
1. Go to https://www.figma.com/
2. Create 1024x1024 frame
3. Design icon
4. Export as PNG

### Option 3: Use Placeholder for Now (Quick Start)

If you don't have assets ready, the build will work with defaults, but create them later for professional presentation.

---

## Temporary Placeholder (For Testing Builds)

If you want to build immediately without custom assets:

```bash
# Download placeholder icon
curl https://via.placeholder.com/1024x1024/1a202c/ffffff?text=GateFlow -o assets/icon.png

# Download placeholder adaptive icon
curl https://via.placeholder.com/1024x1024/1a202c/ffffff?text=GF -o assets/adaptive-icon.png

# Download placeholder splash
curl https://via.placeholder.com/1284x2778/1a202c/ffffff?text=GateFlow -o assets/splash.png

# Download placeholder favicon
curl https://via.placeholder.com/48x48/1a202c/ffffff?text=G -o assets/favicon.png
```

**Note:** Replace these with proper assets before final stakeholder presentation!

---

## Design Recommendations

### Icon Design Best Practices:
- ✅ Simple and recognizable at small sizes
- ✅ Use 2-3 colors maximum
- ✅ Avoid text (hard to read when small)
- ✅ Leave padding around edges (safe zone)
- ✅ Test on both light and dark backgrounds

### Color Scheme (Match App):
- Primary: `#1a202c` (dark blue-gray)
- Success: `#059669` (green - for entry)
- Warning: `#d97706` (orange - for exit)
- Error: `#dc2626` (red - for errors)
- White: `#ffffff`

### Recommended Icon Concepts:
1. **QR Code Symbol** with gate/door element
2. **Gate/Entrance Icon** with scan beam
3. **Security Badge** with checkmark
4. **College/Organization Logo** (if available)

---

## Asset Checklist

Before building for stakeholders:

- [ ] Create `assets/icon.png` (1024x1024)
- [ ] Create `assets/adaptive-icon.png` (1024x1024)
- [ ] Create `assets/splash.png` (1284x2778)
- [ ] Create `assets/favicon.png` (48x48)
- [ ] Test icon visibility on light background
- [ ] Test icon visibility on dark background
- [ ] Verify splash screen looks good
- [ ] Commit assets to git (if using version control)

---

## Can I Build Without Custom Assets?

**Yes!** The build will proceed with Expo's default placeholder assets. However:

❌ Default placeholder looks unprofessional
❌ Stakeholders won't see your branding
❌ App won't stand out

✅ Better to use simple custom assets than defaults
✅ Can update assets later and rebuild
✅ First impression matters for stakeholder demo

---

## Updating Assets After First Build

If you build now and add assets later:

1. Add/update asset files in `assets/` folder
2. Increment version in `app.json`:
   ```json
   "version": "1.0.1",
   "android": { "versionCode": 2 },
   "ios": { "buildNumber": "2" }
   ```
3. Rebuild:
   ```bash
   eas build --platform android --profile production
   ```

---

## Quick Start (No Assets Ready)

```bash
# 1. Create placeholder assets (temporary)
mkdir -p assets
echo "Add assets here before final build" > assets/.gitkeep

# 2. Build anyway (uses Expo defaults)
eas build --platform android --profile production

# 3. Create proper assets later
# 4. Increment version and rebuild
```

---

**Recommendation:** If presenting to stakeholders **within 24 hours**, build with placeholders now for testing, then create proper assets and rebuild before actual presentation.
