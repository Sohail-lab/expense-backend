import { executeQuery } from '../../infrastructure/database/helper.js';

export class PaymentModel {
    async getPaymentsForTransactionAndUser(transactionId: number, userId: number) {
        return await executeQuery(
            `SELECT * FROM payments WHERE transaction_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [transactionId, userId, userId]
        );
    }

    async getPaymentByIdForUser(paymentId: number, userId: number) {
        return await executeQuery(
            `SELECT * FROM payments WHERE payment_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [paymentId, userId, userId]
        );
    }
}
