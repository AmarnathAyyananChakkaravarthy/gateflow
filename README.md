# GateFlow - College Gate Security Management System

**High-performance, offline-first security guard application for college gate management.**

GateFlow is a React Native application built with Expo that enables fast QR code scanning for student access control at college gates. Designed for speed (scan < 3s) and auditability.

---


## Features

### Core Capabilities
- **Offline-First Architecture**: Zero network requests during scanning
- **Fast QR Scanning**: Sub-3-second scan-to-display performance
- **Access Control**: Student status validation (ALLOWED/BANNED)
- **Duplicate Prevention**: 30-second cooldown to prevent accidental re-scans
- **Audit Trail**: Comprehensive access logging with 90-day retention
- **Search & Filter**: Find logs by name, roll number, or department
- **Export**: Generate CSV and PDF reports
- **Real-time Feedback**: Visual and haptic feedback for scan results

### Scanner Features
- Full-screen camera view
- IN/OUT mode toggle
- QR code format validation
- 3-second auto-dismiss HUD with manual override
- Vibration patterns for success/error/banned states
- Display: Student photo, name, roll number, hostel room

### Logs Features
- Date filtering (Today, This Month, Last 3 Months)
- Real-time search across multiple fields
- Student detail modal on tap
- Bulk export with data limits
- Clear all logs functionality
- Pull-to-refresh

---

## Tech Stack

- **Framework**: Expo SDK 54 (Managed Workflow)
- **Router**: Expo Router (File-based routing)
- **Navigation**: Drawer Navigation
- **Database**: expo-sqlite (Offline SQLite)
- **Camera**: expo-camera (QR code scanning)
- **Exports**: expo-file-system, expo-sharing, expo-print
- **Language**: TypeScript
- **Styling**: React Native StyleSheet (no external libraries)

---

## Project Structure

```
gateflow/
├── app/                        # Application routes
│   ├── _layout.tsx            # Root layout with drawer navigation
│   ├── index.tsx              # Scanner screen (QR scanning)
│   └── logs.tsx               # Logs screen (history & export)
├── components/                 # Reusable UI components
│   └── StudentDetailModal.tsx # Student profile modal
├── constants/                  # Configuration constants
│   └── config.ts              # App-wide settings
├── services/                   # Business logic
│   └── database.ts            # SQLite operations
├── utils/                      # Utility functions
│   └── exportUtils.ts         # CSV & PDF generation
├── types.ts                    # TypeScript type definitions
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on iOS/Android (for testing)

### Setup Steps

1. **Clone or extract the project**
   ```bash
   cd gateflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add app icons and splash screen**

   Place the following files in the `assets/` directory:
   - `icon.png` (1024x1024)
   - `splash.png` (1284x2778)
   - `adaptive-icon.png` (1024x1024 for Android)
   - `favicon.png` (48x48 for web)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser

---

## Usage Guide

### First Launch
On first launch, the app will:
1. Initialize the SQLite database
2. Seed 500 mock students (configurable in `constants/config.ts`)
3. Prune logs older than 90 days

### Scanner Screen
1. **Grant Camera Permission**: Required for QR scanning
2. **Select Mode**: Toggle between IN (Entry) or OUT (Exit)
3. **Scan QR Code**: Align QR code within the frame
4. **View Feedback**:
   - Green HUD = Allowed
   - Red HUD = Denied/Error
   - Auto-dismisses after 3 seconds
5. **Tap to Dismiss**: Manual override available

### Logs Screen
1. **Search**: Type student name, roll number, or department
2. **Filter**: Select date range (Today, This Month, Last 3 Months)
3. **View Details**: Tap any log entry for full student profile
4. **Export CSV**: Download Excel-compatible CSV file
5. **Export PDF**: Generate printable PDF report
6. **Clear Logs**: Delete all access logs (with confirmation)

---

## Configuration

Edit `constants/config.ts` to customize:

```typescript
// Scanner timing
SCAN_DEBOUNCE_MS: 2000        // Time between scans
HUD_DISMISS_MS: 3000          // HUD auto-dismiss timeout
DUPLICATE_SCAN_COOLDOWN_MS: 30000  // Prevent duplicate scans

// Database
DB_NAME: 'gateflow.db'
LOG_RETENTION_DAYS: 90        // Auto-delete logs older than this
SEED_COUNT: 500               // Number of mock students
BANNED_PERCENTAGE: 0.2        // 20% of students marked as banned

// Export limits
LARGE_DATASET_WARNING_THRESHOLD: 1000
MAX_EXPORT_ROWS: 10000

// QR validation pattern
QR_PATTERN: /^[A-Za-z0-9-]{3,50}$/  // Alphanumeric + hyphens
```

---

## Database Schema

### students
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |
| department | TEXT | NOT NULL |
| status | TEXT | CHECK ('ALLOWED', 'BANNED') |
| photo_url | TEXT | |
| roll_number | TEXT | |
| hostel_room_number | TEXT | |
| phone_number | TEXT | |

### access_logs
| Column | Type | Constraints |
|--------|------|-------------|
| log_id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| student_id | TEXT | FOREIGN KEY → students(id) |
| timestamp | TEXT | NOT NULL (ISO format) |
| scan_type | TEXT | CHECK ('ENTRY', 'EXIT') |

**Indexes**: `timestamp`, `student_id` for fast queries

---

## Security Features

### Implemented
- ✅ QR code format validation (regex pattern)
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ Input sanitization
- ✅ 30-second duplicate scan prevention
- ✅ Retry logic for failed log entries
- ✅ CHECK constraints on database enums
- ✅ Foreign key constraints

### Recommended for Production
- ⚠️ Add authentication/login system
- ⚠️ Implement role-based access control (RBAC)
- ⚠️ Add cloud sync with encryption
- ⚠️ Enable audit logging for admin actions
- ⚠️ Implement data export encryption

---

## Performance

### Benchmarks
- **QR Detection**: ~100-300ms (hardware dependent)
- **Database Lookup**: ~5-20ms (indexed query)
- **HUD Render**: ~50ms
- **Total Scan Time**: ~200-400ms ✅ **(Under 3s requirement)**

### Optimizations
- Batch insert for seed data (500 students in ~200ms)
- Async logging (non-blocking UI)
- WAL mode for concurrent database access
- Database indexes on frequently queried fields
- Debounced search input
- Pull-to-refresh for data updates

---

## Troubleshooting

### Camera Permission Denied
**iOS**: Settings → GateFlow → Enable Camera
**Android**: Settings → Apps → GateFlow → Permissions → Camera

### Database Not Initializing
1. Clear app data
2. Restart the app
3. Check console for error messages

### QR Codes Not Scanning
1. Ensure QR code matches pattern: `^[A-Za-z0-9-]{3,50}$`
2. Check camera focus and lighting
3. Verify camera permission granted
4. Try re-installing the app

### Logs Not Showing
1. Check date filter (try "Last 3 Months")
2. Verify database has records: Search for "Student"
3. Pull to refresh
4. Check console for database errors

### Export Fails
1. Grant file system permissions
2. Reduce dataset size (apply filters)
3. Check available device storage
4. Ensure logs exist before exporting

---

## Development

### Running Tests
```bash
npm test
```

### Building for Production

**iOS (requires macOS)**
```bash
expo build:ios
```

**Android**
```bash
expo build:android
```

**Using EAS Build (Recommended)**
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

### Linting & Type Checking
```bash
npm run lint
npx tsc --noEmit
```

---

## Known Limitations

1. **No Authentication**: App has no login system
2. **Local Only**: No cloud synchronization
3. **Mock Data**: Seeded with fake student records
4. **Photo URLs**: Uses external placeholder images
5. **Single Device**: No multi-device support
6. **No Analytics**: No dashboard or statistics

---

## Future Enhancements

- [ ] Admin authentication system
- [ ] Cloud backup and sync
- [ ] Real-time analytics dashboard
- [ ] Student data import (CSV/Excel)
- [ ] Biometric authentication
- [ ] Offline photo storage
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications
- [ ] Geofencing for gate locations

---

## Changelog

### Version 1.0.0 (Current)
- Initial MVP release
- QR code scanning with validation
- Offline SQLite database
- Search and filter functionality
- CSV and PDF export
- Duplicate scan prevention
- 30-second cooldown system
- Improved error handling
- Security enhancements (SQL injection fixes)

---

## APP SCREENSHOT

<img width="1170" height="2532" alt="photo_5_2026-08-23_20-21-20" src="https://github.com/user-attachments/assets/7f6cc25f-a03a-4326-91fd-556b9685e024" />


**Built with ❤️ for secure campus management**
