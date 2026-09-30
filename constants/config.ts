/**
 * GateFlow Application Constants
 * Centralized configuration for timing, limits, and UI settings
 */

// Scanner Configuration
export const SCANNER_CONFIG = {
  // Debounce time between scans (milliseconds)
  SCAN_DEBOUNCE_MS: 2000,

  // HUD auto-dismiss timeout (milliseconds)
  HUD_DISMISS_MS: 2000, // Reduced from 3000ms

  // Cooldown period to prevent duplicate scans of same student (milliseconds)
  DUPLICATE_SCAN_COOLDOWN_MS: 30000, // 30 seconds

  // QR code validation pattern (alphanumeric with hyphens)
  QR_PATTERN: /^[A-Za-z0-9-]{3,50}$/,
};

// Vibration Patterns
export const VIBRATION = {
  SUCCESS: 50,
  ERROR: 200,
  BANNED: [0, 100, 50, 100], // Pattern for banned users
};

// Database Configuration
export const DATABASE_CONFIG = {
  // Name of the SQLite database file
  DB_NAME: 'gateflow.db',

  // Number of days to retain logs
  LOG_RETENTION_DAYS: 90,

  // Number of mock students to seed
  SEED_COUNT: 500,

  // Percentage of students that should be marked as BANNED (0-1)
  BANNED_PERCENTAGE: 0.2, // 20%
};

// Export Limits
export const EXPORT_CONFIG = {
  // Warn user if exporting more than this many rows
  LARGE_DATASET_WARNING_THRESHOLD: 1000,

  // Maximum rows to export (prevent memory issues)
  MAX_EXPORT_ROWS: 10000,
};

// UI Configuration
export const UI_CONFIG = {
  // Avatar sizes
  AVATAR_SMALL: 40,
  AVATAR_MEDIUM: 50,
  AVATAR_LARGE: 100,
  AVATAR_XLARGE: 120,

  // Scan reticle size
  SCAN_RETICLE_SIZE: 250,
};

// Color Scheme
export const COLORS = {
  ENTRY_GREEN: '#059669',
  ENTRY_LIGHT: '#d1fae5',
  EXIT_ORANGE: '#d97706',
  EXIT_LIGHT: '#ffedd5',
  ERROR_RED: '#dc2626',
  BACKGROUND_GRAY: '#f3f4f6',
  DARK_HEADER: '#1a202c',
  TEXT_PRIMARY: '#1f2937',
  TEXT_SECONDARY: '#6b7280',
};

// Department List (configurable)
export const DEPARTMENTS = ['CS', 'EE', 'ME', 'CE', 'BBA', 'ECE', 'IT', 'CIVIL'];

// Status Types
export const STUDENT_STATUS = {
  ALLOWED: 'ALLOWED',
  BANNED: 'BANNED',
} as const;

// Scan Types
export const SCAN_TYPES = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
} as const;
