import { executeQuery, executeTransaction } from '../../infrastructure/database/helper.js';
import { TxnData } from '../../domain/types/txnData.js';

export class TransactionService {
    /**
     * Get transactions for a group that involve a specific user
     */
    async getTransactionsByGroupForUser(groupId: number, userId: number) {
        return await executeQuery(
            `SELECT * FROM transactions WHERE group_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [groupId, userId, userId]
        );
    }

    /**
     * Get transaction details
     */
    async getTransactionDetails(transactionId: number, userId: number) {
        return await executeQuery(
            `SELECT * from payments WHERE transaction_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [transactionId, userId, userId]
        );
    }

    /**
     * Create a new transaction
     */
    async createTransaction(txnData: TxnData) {
        const { group_id, initial_amount, description, debt_user, credit_user, remaining_amount, split_transaction } = txnData;

        // Validate input
        if (!group_id || !initial_amount || !debt_user || !credit_user) {
            throw new Error('Missing required transaction fields');
        }

        if (debt_user === credit_user) {
            throw new Error('Debt user and credit user must be different');
        }

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

        return { message: 'Create transaction succeed' };
    }
}
