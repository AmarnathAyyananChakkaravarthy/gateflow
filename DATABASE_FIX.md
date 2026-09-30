# Database Initialization Fix

## Issue: "no such table: students"

### Root Cause
The error occurred because:
1. The `expo-sqlite` v16 API requires explicit import of `openDatabaseAsync`
2. Database instance wasn't being properly cached/reused
3. The app may have tried to query before initialization completed

---

## Fixes Applied

### 1. Updated Database Import ✅

**File**: `services/database.ts`

**Before:**
```typescript
import * as SQLite from 'expo-sqlite';

const getDB = async () => {
  return await SQLite.openDatabaseAsync(DB_NAME);
};
```

**After:**
```typescript
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let dbInstance: SQLiteDatabase | null = null;

const getDB = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await openDatabaseAsync(DB_NAME);
  return dbInstance;
};
```

**Why this fixes it:**
- Correctly imports `openDatabaseAsync` from `expo-sqlite`
- Caches the database instance to avoid re-opening
- Ensures type safety with TypeScript

---

### 2. Enhanced Layout Error Handling ✅

**File**: `app/_layout.tsx`

**Added:**
- Console logging for each initialization step
- Visual error state with error message
- User-friendly alert on failure
- Better loading indicator with text

**Benefits:**
- Clear visibility into initialization progress
- Users see helpful error messages
- Prevents app from hanging on error

---

## How the Database Initialization Works

### Step-by-Step Process:

1. **App Launches** → Layout component mounts
2. **useEffect Triggers** → `setup()` function runs
3. **initDB()** → Creates `students` and `access_logs` tables
4. **seedData()** → Inserts 500 mock students (if table is empty)
5. **pruneOldLogs()** → Deletes logs older than 90 days
6. **setDbReady(true)** → Enables app navigation
7. **App Renders** → Scanner and Logs screens become accessible

### Safeguards:

- Loading screen blocks access until database is ready
- Error screen shows if initialization fails
- Database instance is cached for performance
- All queries use the cached instance

---

## Testing the Fix

### Step 1: Clear App Data (iOS)
```
1. Delete the app from your device
2. Reinstall via Expo Go
3. This ensures a fresh database
```

### Step 2: Watch Console Logs
You should see:
```
Starting database initialization...
Database initialized, seeding data...
Data seeded, pruning old logs...
Database setup complete!
```

### Step 3: Test Scanner
1. Generate QR code with text: `STU-1001`
2. Scan with the app
3. Should see green success screen with student details
4. No "no such table" error

### Step 4: Test Logs
1. Open drawer menu (swipe from left)
2. Tap "Access Logs"
3. Should see the scanned entry
4. No database errors

---

## If You Still See Errors

### Error: "database is locked"
**Cause:** Multiple database connections
**Fix:**
```bash
# Restart the Metro bundler
npm start -- --reset-cache
```

### Error: "no such table"
**Cause:** Database wasn't initialized
**Check:**
1. Look for console logs during app startup
2. Did you see "Database setup complete!"?
3. If not, check what error occurred

### Error: "Failed to fetch student"
**Cause:** Student ID doesn't exist
**Fix:**
- Use IDs from `STU-1001` to `STU-1500`
- Check if database was seeded (console should say "Seeding complete")

---

## Database Location

The SQLite database is stored at:
- **iOS**: `{App Container}/Library/LocalDatabase/gateflow.db`
- **Android**: `{App Data}/databases/gateflow.db`

You can inspect it with:
```bash
# Install SQLite browser
npm install -g sqlite3

# Connect to database (after extracting from device)
sqlite3 gateflow.db

# View tables
.tables

# Count students
SELECT COUNT(*) FROM students;

# View sample student
SELECT * FROM students LIMIT 1;
```

---

## Summary

✅ **Database import corrected**
✅ **Instance caching implemented**
✅ **Error handling enhanced**
✅ **Loading states improved**
✅ **TypeScript compilation successful**

The "no such table: students" error should now be resolved!

---

## Next Steps

1. **Clear app data** and reinstall
2. **Watch console logs** during startup
3. **Test scanning** with `STU-1001`
4. **Verify logs** are being recorded

If the error persists, share the console logs so we can debug further!
