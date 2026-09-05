import { Rank } from "../../models/rank.model";
import { Student } from "../../models/student.model";

export const MOCK_STUDENTS: Student[] = [
  {
    studentId: "X1234",
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2005-03-15'),
    startDate: new Date('2022-01-10'),
    beltSize: 2,
    classAttendance: [new Date('2026-01-05'), new Date('2026-01-12'), new Date('2026-01-19')],
    currentRank: Rank.Yellow,
    lastPaidDues: new Date('2024-01-15'),
    testDetails: [ { testRank: Rank.Yellow, 
          testDate: new Date('2025-12-05'), 
          payment: { paymentType: 1, amount: 75, paymentDate: new Date('2024-01-05'), forMonth: 1, forYear: 2026 },
          testNotes: 'struggled with the techniques', 
          testFee: 50 
        }],
    duesPayments: [{ amount: 50, paymentDate: new Date('2024-01-15') }],
    studentNotes: [{ noteText: 'Great progress', dateAdded: new Date('2024-01-10') }],
    waiverLink: 'http://example.com/waiver1'
  },
  {
    studentId: "X1235",
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('2006-07-22'),
    startDate: new Date('2022-06-15'),
    beltSize: 1,
    classAttendance: [new Date('2026-01-06'), new Date('2026-01-13'), new Date('2026-01-20')],
    currentRank: Rank.Green2,
    lastPaidDues: new Date('2024-01-20'),
    testDetails: [
        { testRank: Rank.Green1, 
          testDate: new Date('2026-01-05'), 
          payment: { paymentType: 2, amount: 75, paymentDate: new Date('2024-01-05'), forMonth: 1, forYear: 2026 },
          testNotes: 'Could have been better', 
          testFee: 50 
        },
         { testRank: Rank.Blue, 
          testDate: new Date('2025-01-05'), 
          payment: { paymentType: 1, amount: 75, paymentDate: new Date('2024-01-05'), forMonth: 1, forYear: 2026 },
          testNotes: 'Excellent performance', 
          testFee: 50 
        },
        { testRank: Rank.Yellow, 
          testDate: new Date('2024-12-05'), 
          payment: { paymentType: 3, amount: 75, paymentDate: new Date('2024-01-05'), forMonth: 1, forYear: 2026 },
          testNotes: 'Fell down and cried', 
          testFee: 50 
        }
    ],
    
    duesPayments: [{ amount: 50, paymentDate: new Date('2024-01-20'), forMonth: 1, forYear: 2026 }],
    studentNotes: [{ noteText: 'Excellent technique', dateAdded: new Date('2024-01-15') }],
    waiverLink: 'http://example.com/waiver2'
  },
  {
    studentId: "X1236",
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: new Date('2004-11-08'),
    startDate: new Date('2021-09-01'),
    beltSize: 3,
    classAttendance: [new Date('2026-01-07'), new Date('2026-01-14'), new Date('2026-01-21')],
    currentRank: Rank.Blue,
    lastPaidDues: new Date('2024-01-10'),
    testDetails: [
         { testRank: Rank.Yellow, 
          testDate: new Date('2026-01-05'), 
          payment: { paymentType: 3, amount: 75, paymentDate: new Date('2024-01-05'), forMonth: 1, forYear: 2026 },
          testNotes: 'good job', 
          testFee: 50 
        }
    ],
    duesPayments: [{ amount: 50, paymentDate: new Date('2024-01-10') }],
    studentNotes: [{ noteText: 'Needs to work on kicks', dateAdded: new Date('2024-01-08') }],
    waiverLink: 'http://example.com/waiver3'
  }
];