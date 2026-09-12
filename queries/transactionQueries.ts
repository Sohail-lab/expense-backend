import { executeQuery } from "../helper.js";

export const getTransactionByIdForUser = (transactionId: number, userId: number) => executeQuery(
    `
    SELECT * FROM transactions WHERE transaction_id = ? AND (debt_user = ? OR credit_user = ?);
    `,
    [transactionId, userId, userId]
);

