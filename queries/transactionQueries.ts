import { executeQuery, executeTransaction } from "../helper.js";
import { TxnData } from "../types/txnData.js";

export const getTransactionByGroupForUser = (groupId: number, userId: number) => executeQuery(
    `
    SELECT * FROM transactions WHERE group_id = ? AND (debt_user = ? OR credit_user = ?);
    `,
    [groupId, userId, userId]
);

export const createTransaction = async (txnData: TxnData) => {
    const { group_id, initial_amount, description, debt_user, credit_user, remaining_amount, split_transaction } = txnData;
    await executeTransaction(
        `
        SET @next_transaction_id = (
            SELECT IFNULL(MAX(transaction_id), 0) + 1
            FROM transactions
        );
        INSERT INTO transactions
        (transaction_id, group_id, initial_amount, description, debt_user, credit_user, remaining_amount, split_transaction)
        VALUES
        (@next_transaction_id, ?, ?, ?, ?, ?, ?, ?);
        `,
        [group_id, initial_amount, description, debt_user, credit_user, remaining_amount, split_transaction]
    );
};