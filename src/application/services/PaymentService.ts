import { executeQuery } from '../../infrastructure/database/helper.js';

export class PaymentService {
    /**
     * Get all payments for a transaction that involve a specific user
     */
    async getPaymentsForTransactionAndUser(transactionId: number, userId: number) {
        return await executeQuery(
            `SELECT * FROM payments WHERE transaction_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [transactionId, userId, userId]
        );
    }

    /**
     * Get a specific payment by ID for a user
     */
    async getPaymentByIdForUser(paymentId: number, userId: number) {
        const payments = await executeQuery(
            `SELECT * FROM payments WHERE payment_id = ? AND (debt_user = ? OR credit_user = ?);`,
            [paymentId, userId, userId]
        );

        if (!payments || payments.length === 0) {
            throw new Error('Payment not found');
        }

        return payments[0];
    }
}
