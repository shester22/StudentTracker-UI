import { Note } from "./note.model";
import { Payment } from "./payment.model";
import { Rank } from "./rank.model";
import { TestDetail } from "./test-detail.model";
import { AttendanceDetail } from "./attendance-detail";

export class Student {
  studentId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  // imageUrl?: string;
  startDate?: Date; 
  beltSize?: number;
  attendanceListId?: string;
  classAttendance: AttendanceDetail[] = [];
  currentRank?: Rank;
  lastPaidDues?: Date;
  testDetails: TestDetail[] = [];
  paymentListId?: string;
  duesPayments: Payment[] = [];
  noteListId?: string;
  studentNotes: Note[] = [];
  waiverLink?: string;
  active?: boolean;

  

//   get currentRank(): Rank | undefined {
//     if (this._testDetails && this._testDetails.length > 0) {
//       return Math.max(...this._testDetails.map(td => td.testRank || 0)) as any;
//     }
//     return this._currentRank;
//   }

//   set currentRank(value: Rank | undefined) {
//     this._currentRank = value;
//   }

//   get testDetails(): TestDetail[] | undefined {
//     return this._testDetails;
//   }

//   set testDetails(value: TestDetail[] | undefined) {
//     this._testDetails = value;
//   }

//   constructor() {
//   }
}


