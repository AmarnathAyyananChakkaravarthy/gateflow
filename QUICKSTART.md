# GateFlow - Quick Start Guide

## Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd gateflow
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Open on Your Phone
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code that appears in your terminal
3. Wait for the app to load

### Step 4: Grant Camera Permission
When the app opens, tap **"Grant Camera Permission"** to enable QR scanning.

### Step 5: Test Scanning
1. Generate a test QR code with content: `STU-1001` (or any STU-1001 through STU-1500)
2. Point your camera at the QR code
3. You should see a green success screen with student details!

---

## Testing the Scanner

### Generate Test QR Codes
Use any QR code generator (like [qr-code-generator.com](https://www.qr-code-generator.com/)) with these IDs:

**✅ Allowed Students** (will show green):
- `STU-1001`
- `STU-1002`
- `STU-1003`
- `STU-1004`

**❌ Banned Students** (will show red):
- `STU-1005` (every 5th student is banned)
- `STU-1010`
- `STU-1015`

### Scanner Features to Test
1. **IN/OUT Toggle**: Tap the toggle at the top to switch between ENTRY and EXIT modes
2. **Duplicate Prevention**: Scan the same QR code twice within 30 seconds - you'll see a cooldown message
3. **Invalid QR**: Try scanning a QR code with text like "Hello World" - you'll see an "INVALID QR CODE" error
4. **Manual Dismiss**: Tap the HUD (success/error screen) to dismiss it immediately

---

## Testing the Logs Screen

### Access the Logs
1. Swipe from the left edge of the screen (or tap the menu icon)
2. Tap **"Access Logs"**

### Features to Test
1. **Search**: Type a student name, roll number, or department in the search bar
2. **Filter**: Tap "Today", "This Month", or "Last 3 Months" to filter by date
3. **View Details**: Tap any log entry to see the full student profile
4. **Export CSV**: Tap the "CSV" button to export logs
5. **Export PDF**: Tap the "PDF" button to generate a printable report
6. **Clear Logs**: Tap the trash icon to delete all logs (with confirmation)

---

## Common Issues

### ❌ "No Camera Access"
**Fix**: Allow camera permission in your phone's settings

### ❌ "INVALID QR CODE"
**Fix**: Ensure your QR code contains only letters, numbers, and hyphens (e.g., `STU-1001`)

### ❌ "STUDENT NOT FOUND"
**Fix**: Use student IDs from `STU-1001` to `STU-1500` (500 pre-seeded students)

### ❌ Logs not showing
**Fix**: Change the date filter to "Last 3 Months" - logs may be from previous sessions

---

## What's Pre-Loaded?

The app comes with **500 mock students**:
- **IDs**: `STU-1001` through `STU-1500`
- **Departments**: CS, EE, ME, CE, BBA, ECE, IT, CIVIL
- **Status**: 80% ALLOWED, 20% BANNED (every 5th student)
- **Roll Numbers**: Format `2024-{DEPT}-{NUMBER}`
- **Hostel Rooms**: Format `H{1-10}-{100-149}`

---

## Next Steps

Once you've tested the basics:

1. **Customize Settings**: Edit [constants/config.ts](constants/config.ts) to adjust:
   - Scan debounce time
   - HUD dismiss timeout
   - Duplicate scan cooldown
   - Database retention period

2. **Read Full Documentation**: See [README.md](README.md) for complete features and API

3. **Build for Production**: Follow deployment instructions in the README

---

## Quick Commands Reference

```bash
npm start          # Start development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

---

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Check the Troubleshooting section in README
- 💬 Review console logs in your terminal for errors

---

**Happy Scanning! 🎯**
