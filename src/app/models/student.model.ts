import { Note } from "./note.model";
import { Payment } from "./payment.model";
import { Rank } from "./rank.model";
import { TestDetail } from "./test-detail.model";

export class Student {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateofBith?: Date;
  // imageUrl?: string;
  startDate?: Date; 
  beltSize?: number;
  classAttendance: Date[] = [];
  currentRank?: Rank;
  lastPaidDues?: Date;
  testDetails: TestDetail[] = [];
  duesPayments: Payment[] = [];
  studentNotes: Note[] = [];
  waiverLink?: string;

  

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


