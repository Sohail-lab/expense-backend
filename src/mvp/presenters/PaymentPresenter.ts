import { PaymentModel } from '../models/PaymentModel.js';

export class PaymentPresenter {
    constructor(private model: PaymentModel) {}

    async getPaymentsForTransactionAndUser(transactionId: number, userId: number) {
        return await this.model.getPaymentsForTransactionAndUser(transactionId, userId);
    }

    async getPaymentByIdForUser(paymentId: number, userId: number) {
        const payments = await this.model.getPaymentByIdForUser(paymentId, userId);

        if (!payments || payments.length === 0) {
            throw new Error('Payment not found');
        }

        return payments[0];
    }
}
