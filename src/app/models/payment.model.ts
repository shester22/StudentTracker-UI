import { MonthEnum } from "./month-enum.enum";
import { PaymentType } from "./payment-type.model";

export interface Payment{
    paymentType?: PaymentType;
    amount: number;
    paymentDate: Date;
    forMonth?: MonthEnum;
    forYear?: number;
    paymentNotes?: string;
}

export interface PaymentList {
    studentId: string;
    paymentListId: string;
    count: number;
    payments: Payment[];
}

// this model is used when a list of all payments from all students is needed
// it will produce a list of payments that include the payment Doc id and the student Id
export interface StudentPaymentList extends Payment{
    studentId: string;
    paymentListId: string;

}