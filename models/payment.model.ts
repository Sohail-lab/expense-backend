export interface IPayment {
    payment_id: number;
    transaction_id: number;
    note: string;
    debt_user: number;
    credit_user: number;
    amount: number;
    created_at: string;
}