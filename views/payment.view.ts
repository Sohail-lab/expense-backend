import { IPayment } from "../models/payment.model";

export function showMessage(message: string) {
    return {
        message: message,
    }
}

function paymentDetails(p: IPayment) {
    return {
        payment_id: p.payment_id,
        transaction_id: p.transaction_id,
        note: p.note,
        debt_user: p.debt_user,
        credit_user: p.credit_user,
        amount: p.amount,
        created_at: p.created_at
    }
}

export function listPaymentDetails(paymentList: IPayment[]) {
    return paymentList.map(paymentDetails);
}