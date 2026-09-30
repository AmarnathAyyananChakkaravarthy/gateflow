import { AccessLog } from '../types';
import { COLORS } from '../constants/config';

/**
 * Generates RFC 4180 compliant CSV from access logs
 * @param data Array of access logs to export
 * @returns CSV formatted string
 */
export const generateCSV = (data: AccessLog[]): string => {
  const header = 'Log ID,Time,Type,Student ID,Name,Roll No,Dept,Hostel Room\n';

  const rows = data.map(log => {
    const time = new Date(log.timestamp).toLocaleString();

    // Escape commas and quotes for CSV compliance (RFC 4180)
    const clean = (str: string = '') => `"${str.replace(/"/g, '""')}"`;

    return [
      log.log_id,
      clean(time),
      log.scan_type,
      clean(log.student_id),
      clean(log.name || 'Unknown'),
      clean(log.roll_number || 'N/A'),
      clean(log.department || 'N/A'),
      clean(log.hostel_room_number || 'N/A')
    ].join(',');
  });

  return header + rows.join('\n');
};

/**
 * Generates styled HTML for PDF export
 * @param data Array of access logs to export
 * @param title Report title/filter label
 * @returns HTML string ready for PDF conversion
 */
export const generateHTML = (data: AccessLog[], title: string): string => {
  const rows = data.map(log => {
    const time = new Date(log.timestamp).toLocaleString();
    const isEntry = log.scan_type === 'ENTRY';
    const bgColor = isEntry ? '#e6fffa' : '#fff5f5';
    const textColor = isEntry ? COLORS.ENTRY_GREEN : COLORS.EXIT_ORANGE;

    return `
      <tr style="background-color: ${bgColor}">
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${time}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: ${textColor}; font-weight: bold; font-size: 12px;">
          ${log.scan_type}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${log.name || 'Unknown'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${log.student_id || '-'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${log.roll_number || '-'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${log.department || '-'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${log.hostel_room_number || '-'}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            padding: 30px;
            background: white;
            color: #333;
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 3px solid ${COLORS.DARK_HEADER};
            padding-bottom: 20px;
          }
          h1 {
            color: ${COLORS.DARK_HEADER};
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
          }
          .subtitle {
            color: #666;
            font-size: 14px;
            margin-top: 4px;
          }
          .meta {
            display: flex;
            gap: 20px;
            margin-top: 12px;
            font-size: 13px;
            color: #555;
          }
          .meta-item {
            display: flex;
            align-items: center;
          }
          .meta-label {
            font-weight: 600;
            margin-right: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            text-align: left;
            background-color: ${COLORS.DARK_HEADER};
            color: white;
            padding: 12px 10px;
            border-bottom: 2px solid #2d3748;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GateFlow Access Report</h1>
          <div class="subtitle">Security Gate Monitoring System</div>
          <div class="meta">
            <div class="meta-item">
              <span class="meta-label">Period:</span>
              <span>${title}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Generated:</span>
              <span>${new Date().toLocaleString()}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Records:</span>
              <span>${data.length}</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Hostel Room</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <p>This report is generated by GateFlow - College Gate Security Management System</p>
          <p>For official use only. Keep confidential.</p>
        </div>
      </body>
    </html>
  `;
};
