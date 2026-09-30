# Quick Build Commands - GateFlow

## One-Time Setup (5 minutes)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to Expo (create free account at expo.dev if needed)
eas login

# 3. Configure project
cd c:\Users\Admin\Downloads\gateflow
eas build:configure
```

---

## Build Commands

### Android APK (Recommended for Stakeholders)

```bash
# Production APK (~15-20 min build time)
eas build --platform android --profile production

# Preview APK (faster, ~10-15 min)
eas build --platform android --profile preview
```

**After build completes:**
1. Download APK from link in terminal
2. Share APK file with stakeholders
3. Install on Android device (enable "Unknown Sources")

---

### iOS App (Requires Apple Developer Account)

```bash
# Production IPA (requires $99/year Apple Developer Account)
eas build --platform ios --profile production

# OR use Expo Go for free demo (no build needed):
npx expo start
# Scan QR with Expo Go app
```

---

## Check Build Status

```bash
# List all builds
eas build:list

# Check specific build
eas build:view [BUILD_ID]

# Open builds in browser
eas build:list --json | jq -r '.[0].id' | xargs -I {} open https://expo.dev/builds/{}
```

---

## Download Completed Builds

**Option 1: From Terminal**
- Build completion message includes download URL
- Click the URL to download

**Option 2: From Dashboard**
1. Go to https://expo.dev
2. Navigate to Projects → GateFlow → Builds
3. Click on completed build
4. Click "Download" button

**Option 3: Direct Install Link**
- EAS provides a shareable install page
- Example: `https://expo.dev/artifacts/eas/[build-id].apk`
- Share this link with stakeholders for direct install

---

## Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
```bash
# View build logs
eas build:list
# Click on failed build to see detailed logs
```

### Need to rebuild?
```bash
# Same command, EAS will queue a new build
eas build --platform android --profile production
```

---

## For Stakeholder Presentation

### Android Users:
```bash
# 1. Build APK
eas build --platform android --profile production

# 2. Wait for completion (~15 min)
# 3. Download APK
# 4. Share with stakeholders
```

### iOS Users (Without Apple Developer Account):
```bash
# Use Expo Go (instant, free):
npx expo start

# Stakeholder:
# 1. Install "Expo Go" from App Store
# 2. Scan QR code from your terminal
# 3. App opens immediately
```

### iOS Users (With Apple Developer Account):
```bash
# 1. Build IPA
eas build --platform ios --profile production

# 2. Upload to TestFlight automatically
# 3. Invite stakeholders via TestFlight email
```

---

## Quick Reference

| Command | Purpose | Time | Output |
|---------|---------|------|--------|
| `eas build -p android` | Android APK | 15-20 min | `.apk` file |
| `eas build -p ios` | iOS IPA | 20-25 min | `.ipa` file |
| `eas build -p all` | Both platforms | 20-25 min | Both files |
| `npx expo start` | Dev server | Instant | QR code |
| `eas build:list` | View builds | Instant | Build list |

---

## Pro Tips

1. **Build both platforms at once:**
   ```bash
   eas build --platform all --profile production
   ```

2. **Get install link after build:**
   - Copy the link from build completion message
   - Or visit: https://expo.dev/accounts/[you]/projects/gateflow/builds

3. **Test before sharing:**
   - Always install and test on your device first
   - Check QR scanning works
   - Verify database initializes correctly

4. **Create QR codes for demo:**
   - Use https://www.qr-code-generator.com/
   - Generate codes for: `STU-1001`, `STU-1002`, etc.
   - Print them for easy scanning during demo

---

**Need detailed instructions?** See [BUILD_GUIDE.md](./BUILD_GUIDE.md)
