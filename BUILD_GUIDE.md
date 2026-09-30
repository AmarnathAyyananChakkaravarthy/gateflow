# GateFlow - Production Build Guide

This guide will help you create shareable APK (Android) and IPA (iOS) builds for stakeholder presentations.

---

## Prerequisites

Before building, ensure you have:

1. **Node.js and npm** installed (already done ✅)
2. **Expo account** (free) - Create at https://expo.dev/signup
3. **EAS CLI** installed globally

---

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

**Verify installation:**
```bash
eas --version
```

---

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials when prompted.

**Verify login:**
```bash
eas whoami
```

---

## Step 3: Configure Your Project

Link your project to EAS:

```bash
cd c:\Users\Admin\Downloads\gateflow
eas build:configure
```

This will:
- Create/update `eas.json` (already created ✅)
- Link project to your Expo account
- Generate a unique project ID

---

## Step 4: Build for Android (APK)

### Option A: Production APK (Recommended for Stakeholders)

```bash
eas build --platform android --profile production
```

### Option B: Preview APK (Faster, for testing)

```bash
eas build --platform android --profile preview
```

**Build Process:**
1. EAS will ask if you want to generate a new Android keystore → Select **Yes**
2. Build will be queued on Expo servers (takes 10-20 minutes)
3. Progress shown in terminal and at https://expo.dev/accounts/[your-account]/projects/gateflow/builds

**Download APK:**
- Once complete, download link appears in terminal
- Also available at: https://expo.dev/accounts/[your-account]/projects/gateflow/builds
- Click on build → Download APK
- Share this APK file with stakeholders

**APK File Size:** ~50-80 MB

**Installation on Android:**
1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap APK to install
4. Grant camera permissions when prompted

---

## Step 5: Build for iOS (IPA)

### Important Notes for iOS:
- **IPA files require an Apple Developer Account** ($99/year)
- **Without Apple Developer Account:** You can only build for simulator or use Expo Go
- **For stakeholder demo:** Consider using **TestFlight** (requires Apple Developer Account)

### Option A: With Apple Developer Account

```bash
eas build --platform ios --profile production
```

**You'll need:**
1. Apple ID enrolled in Apple Developer Program
2. App Store Connect API Key (EAS will guide you)

**EAS will:**
1. Generate provisioning profiles
2. Create signing certificates
3. Build IPA file
4. You can then upload to TestFlight for distribution

### Option B: Without Apple Developer Account (Simulator Build)

```bash
eas build --platform ios --profile preview --simulator
```

**This creates:**
- Simulator build (.app file)
- Can only run on macOS Simulators
- **Cannot install on physical iOS devices**

### Option C: Alternative for iOS Demo (Recommended)

**Use Expo Go for stakeholder demo:**

1. Install Expo Go app on iOS device (App Store)
2. Run development server:
   ```bash
   npx expo start
   ```
3. Scan QR code with Expo Go
4. App runs instantly without build process

**Pros:**
- No Apple Developer Account needed
- Instant updates
- Free

**Cons:**
- Requires internet connection
- Shows "Powered by Expo Go" branding
- Limited offline functionality

---

## Step 6: Check Build Status

### Via Terminal:
```bash
eas build:list
```

### Via Web Dashboard:
https://expo.dev/accounts/[your-account]/projects/gateflow/builds

---

## Step 7: Download and Share Builds

### Android APK:
1. Go to https://expo.dev
2. Navigate to Projects → GateFlow → Builds
3. Click on completed Android build
4. Click "Download" button
5. Share the `.apk` file via email/cloud storage

**Shareable Link:**
- EAS provides a public install link
- Example: `https://expo.dev/artifacts/eas/[build-id].apk`
- Share this link directly with stakeholders

### iOS IPA (if built):
1. Same process as Android
2. Upload to TestFlight for distribution
3. Send TestFlight invite links to stakeholders

---

## Quick Build Commands Summary

### Android Production APK:
```bash
cd c:\Users\Admin\Downloads\gateflow
eas build --platform android --profile production
```

### iOS Production (Requires Apple Developer Account):
```bash
eas build --platform ios --profile production
```

### Both Platforms at Once:
```bash
eas build --platform all --profile production
```

---

## Build Profiles Explained

Our `eas.json` has 3 profiles:

### 1. **development**
- For development testing
- Includes dev tools
- Not for stakeholders

### 2. **preview** (Recommended for quick demos)
- Creates APK (Android) or Simulator build (iOS)
- Faster than production builds
- Good for stakeholder previews

### 3. **production** (Recommended for final release)
- Optimized and minified
- Smaller file size
- Best performance
- Use for official stakeholder presentations

---

## Troubleshooting

### Build Failed?

**Check logs:**
```bash
eas build:list
# Click on failed build ID to see logs
```

**Common issues:**

1. **"No Expo account"**
   ```bash
   eas login
   ```

2. **"Project not configured"**
   ```bash
   eas build:configure
   ```

3. **"Build timeout"**
   - Retry the build command
   - Check Expo status: https://status.expo.dev

4. **"Invalid credentials"**
   ```bash
   eas credentials
   ```

### Android Build Issues:

**"Keystore error"**
```bash
eas credentials --platform android
# Select "Remove keystore" then rebuild
```

### iOS Build Issues:

**"Provisioning profile error"**
- Ensure Apple Developer Account is active
- Run: `eas credentials --platform ios`

---

## Cost Breakdown

### Free Tier (Current):
- ✅ Unlimited builds for Android
- ✅ Unlimited builds for iOS
- ✅ Build queue (may have wait times during peak hours)

### Paid Tier ($29/month - Optional):
- ⚡ Priority build queue (faster builds)
- 📊 Advanced analytics
- 🔄 OTA updates

**For stakeholder demo:** Free tier is sufficient ✅

---

## Recommended Workflow for Stakeholder Demo

### For Android Stakeholders:
1. Run: `eas build --platform android --profile production`
2. Wait 10-20 minutes
3. Download APK from build dashboard
4. Share APK file or install link
5. ✅ Done!

### For iOS Stakeholders:

**Option 1: Use Expo Go (Easiest)**
1. Stakeholder installs Expo Go from App Store
2. You run: `npx expo start`
3. Stakeholder scans QR code
4. ✅ Demo ready!

**Option 2: TestFlight (Professional)**
1. Get Apple Developer Account ($99/year)
2. Run: `eas build --platform ios --profile production`
3. Upload to TestFlight
4. Invite stakeholders via email
5. ✅ Professional distribution!

---

## Next Steps After Build

1. **Test the build** on actual devices before sharing
2. **Prepare demo data** (QR codes with STU-1001 to STU-1500)
3. **Create demo script** showing:
   - QR scanning (Entry/Exit modes)
   - Access logs viewing
   - CSV export functionality
4. **Backup build files** for future reference

---

## Build Artifacts Location

After successful builds, files are available at:

**Web Dashboard:**
https://expo.dev/accounts/[your-account]/projects/gateflow/builds

**Local Cache:**
- Android: Downloads folder (when you download)
- iOS: Downloads folder (when you download)

---

## Support

**Need help?**
- Expo Build Docs: https://docs.expo.dev/build/introduction/
- EAS CLI Docs: https://docs.expo.dev/eas/cli/
- Expo Discord: https://chat.expo.dev/

---

## Summary Checklist

Before presenting to stakeholders:

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Configure project: `eas build:configure`
- [ ] Build Android APK: `eas build --platform android --profile production`
- [ ] Download APK from dashboard
- [ ] Test APK on Android device
- [ ] (iOS) Choose Expo Go or TestFlight approach
- [ ] Prepare demo QR codes (STU-1001, STU-1002, etc.)
- [ ] Test scanning, logging, and export features
- [ ] ✅ Ready for stakeholder demo!

---

**Good luck with your presentation! 🎉**
