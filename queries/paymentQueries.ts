import { executeQuery, executeTransaction } from "../helper";

export const getAllPaymentsForTransactionAndUser = (transactionId: number, userId: number) => executeQuery(
    `
    SELECT * FROM payments WHERE transaction_id = ? AND (debt_user = ? OR credit_user = ?);
    `,
    [transactionId, userId, userId]
);

export const getPaymentByIdForUser = (paymentId: number, userId: number) => executeQuery(
    `
    SELECT * FROM payments WHERE payment_id = ? AND (debt_user = ? OR credit_user = ?);
    `,
    [paymentId, userId, userId]
);