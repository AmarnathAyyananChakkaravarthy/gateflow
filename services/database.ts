import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { Student, AccessLog, DateFilter, ScanType } from '../types';
import { DATABASE_CONFIG, DEPARTMENTS, STUDENT_STATUS } from '../constants/config';

const { DB_NAME, LOG_RETENTION_DAYS, SEED_COUNT, BANNED_PERCENTAGE } = DATABASE_CONFIG;

// Global database instance
let dbInstance: SQLiteDatabase | null = null;

// Open database asynchronously
const getDB = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await openDatabaseAsync(DB_NAME);
  return dbInstance;
};

export const initDB = async (): Promise<void> => {
  try {
    const db = await getDB();

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('ALLOWED', 'BANNED')),
        photo_url TEXT,
        roll_number TEXT,
        hostel_room_number TEXT,
        phone_number TEXT
      );
      CREATE TABLE IF NOT EXISTS access_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        scan_type TEXT NOT NULL CHECK(scan_type IN ('ENTRY', 'EXIT')),
        FOREIGN KEY (student_id) REFERENCES students(id)
      );
      CREATE INDEX IF NOT EXISTS idx_timestamp ON access_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_student_id ON access_logs(student_id);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error('Database initialization failed');
  }
};

export const seedData = async (): Promise<void> => {
  try {
    const db = await getDB();

    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM students');
    if (result && result.count > 0) {
      console.log(`Database already seeded with ${result.count} students`);
      return;
    }

    console.log('Seeding database...');

    const statuses = Array(Math.floor(1 / BANNED_PERCENTAGE)).fill(STUDENT_STATUS.ALLOWED);
    statuses[0] = STUDENT_STATUS.BANNED; // Ensures at least some are banned

    // Batch insert for performance
    let query = 'INSERT INTO students (id, name, department, status, photo_url, roll_number, hostel_room_number, phone_number) VALUES ';
    const params: string[] = [];
    const rows: string[] = [];

    for (let i = 1; i <= SEED_COUNT; i++) {
      const id = `STU-${1000 + i}`;
      const name = `Student ${i}`;
      const dept = DEPARTMENTS[i % DEPARTMENTS.length];
      const status = statuses[i % statuses.length];
      const photo = `https://picsum.photos/seed/${id}/200/200`;
      const roll = `2024-${dept}-${100 + i}`;
      const room = `H${(i % 10) + 1}-${100 + (i % 50)}`;
      const phone = `555-01${i.toString().padStart(3, '0')}`;

      rows.push('(?, ?, ?, ?, ?, ?, ?, ?)');
      params.push(id, name, dept, status, photo, roll, room, phone);
    }

    query += rows.join(', ');

    await db.runAsync(query, params);
    console.log(`Seeding complete: ${SEED_COUNT} students added.`);
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw new Error('Database seeding failed');
  }
};

export const pruneOldLogs = async (): Promise<void> => {
  try {
    const db = await getDB();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - LOG_RETENTION_DAYS);

    const result = await db.runAsync(
      'DELETE FROM access_logs WHERE timestamp < ?',
      [cutoff.toISOString()]
    );

    if (result.changes > 0) {
      console.log(`Pruned ${result.changes} logs older than ${LOG_RETENTION_DAYS} days`);
    }
  } catch (error) {
    console.error('Failed to prune old logs:', error);
    // Don't throw - this is a background cleanup task
  }
};

export const getStudent = async (id: string): Promise<Student | null> => {
  try {
    const db = await getDB();
    return await db.getFirstAsync<Student>('SELECT * FROM students WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return null;
  }
};

export const logAccess = async (studentId: string, scanType: ScanType): Promise<void> => {
  try {
    const db = await getDB();
    await db.runAsync(
      'INSERT INTO access_logs (student_id, timestamp, scan_type) VALUES (?, ?, ?)',
      [studentId, new Date().toISOString(), scanType]
    );
  } catch (error) {
    console.error('Failed to log access:', error);
    throw error; // Re-throw so calling code can handle retry
  }
};

export const getLogs = async (filter: DateFilter): Promise<AccessLog[]> => {
  try {
    const db = await getDB();
    const now = new Date();
    let dateQuery = '';
    const params: string[] = [];

    switch (filter) {
      case 'TODAY': {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        dateQuery = 'WHERE l.timestamp >= ?';
        params.push(startOfDay);
        break;
      }
      case 'MONTH': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        dateQuery = 'WHERE l.timestamp >= ?';
        params.push(startOfMonth);
        break;
      }
      case 'LAST_3_MONTHS': {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
        dateQuery = 'WHERE l.timestamp >= ?';
        params.push(threeMonthsAgo);
        break;
      }
    }

    // Join with students table to get details - FIXED: Using parameterized query
    const query = `
      SELECT
        l.log_id, l.student_id, l.timestamp, l.scan_type,
        s.name, s.photo_url, s.department, s.roll_number, s.hostel_room_number, s.phone_number
      FROM access_logs l
      LEFT JOIN students s ON l.student_id = s.id
      ${dateQuery}
      ORDER BY l.timestamp DESC
    `;

    return await db.getAllAsync<AccessLog>(query, params);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return [];
  }
};

export const searchLogs = async (searchTerm: string, filter: DateFilter): Promise<AccessLog[]> => {
  try {
    const db = await getDB();
    const now = new Date();
    let dateQuery = '';
    const params: string[] = [];
    const searchPattern = `%${searchTerm}%`;

    switch (filter) {
      case 'TODAY': {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        dateQuery = 'AND l.timestamp >= ?';
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, startOfDay);
        break;
      }
      case 'MONTH': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        dateQuery = 'AND l.timestamp >= ?';
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, startOfMonth);
        break;
      }
      case 'LAST_3_MONTHS': {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
        dateQuery = 'AND l.timestamp >= ?';
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, threeMonthsAgo);
        break;
      }
    }

    const query = `
      SELECT
        l.log_id, l.student_id, l.timestamp, l.scan_type,
        s.name, s.photo_url, s.department, s.roll_number, s.hostel_room_number, s.phone_number
      FROM access_logs l
      LEFT JOIN students s ON l.student_id = s.id
      WHERE (
        s.name LIKE ? OR
        s.roll_number LIKE ? OR
        s.department LIKE ? OR
        l.student_id LIKE ?
      )
      ${dateQuery}
      ORDER BY l.timestamp DESC
    `;

    return await db.getAllAsync<AccessLog>(query, params);
  } catch (error) {
    console.error('Failed to search logs:', error);
    return [];
  }
};

export const getRecentScan = async (studentId: string): Promise<AccessLog | null> => {
  try {
    const db = await getDB();
    const query = `
      SELECT * FROM access_logs
      WHERE student_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    return await db.getFirstAsync<AccessLog>(query, [studentId]);
  } catch (error) {
    console.error('Failed to fetch recent scan:', error);
    return null;
  }
};

export const clearAllLogs = async (): Promise<number> => {
  try {
    const db = await getDB();
    const result = await db.runAsync('DELETE FROM access_logs');
    console.log(`Cleared ${result.changes} logs`);
    return result.changes;
  } catch (error) {
    console.error('Failed to clear logs:', error);
    throw error;
  }
};
