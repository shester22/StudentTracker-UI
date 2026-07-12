import { Note } from "./note.model";
import { Payment } from "./payment.model";
import { Rank } from "./rank.model";

export interface TestDetail {
  testRank: Rank;
  testDate: Date;
  testFee: Number;
  payment?: Payment;
  testNotes?: string;
}


