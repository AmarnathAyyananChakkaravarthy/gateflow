export interface Student {
  id: string; // QR Payload
  name: string;
  department: string;
  status: 'ALLOWED' | 'BANNED';
  photo_url: string;
  roll_number: string;
  hostel_room_number: string;
  phone_number: string;
}

export interface AccessLog {
  log_id: number;
  student_id: string;
  timestamp: string; // ISO String
  scan_type: 'ENTRY' | 'EXIT';
  // Joined fields for display
  name?: string;
  photo_url?: string;
  department?: string;
  roll_number?: string;
  hostel_room_number?: string;
  phone_number?: string;
}

export type ScanType = 'ENTRY' | 'EXIT';

export type DateFilter = 'TODAY' | 'MONTH' | 'LAST_3_MONTHS';
