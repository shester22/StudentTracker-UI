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