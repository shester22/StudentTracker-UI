import { AttendanceDetail } from './attendance-detail';

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  count: number;
  listItems: AttendanceDetail[];
}
