import { Request, Response } from 'express';
import { PaymentService } from '../../application/services/PaymentService.js';
import { LOG } from '../../infrastructure/database/helper.js';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    /**
     * Get payments for a transaction and user
     */
    async getPaymentsForTransaction(req: Request, res: Response): Promise<void> {
        try {
            const txnId = Number(req.query.id);
            const uid = Number(req.query.uid);

            if (isNaN(txnId) || isNaN(uid)) {
                res.status(400).json({ error: 'Invalid transaction ID or user ID' });
                return;
            }

            const rows = await this.paymentService.getPaymentsForTransactionAndUser(txnId, uid);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG('Error fetching payments', true, error);
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    }

    /**
     * Get payment details for a user
     */
    async getPaymentDetails(req: Request, res: Response): Promise<void> {
        try {
            const uid = Number(req.params.uid);
            const paymentId = Number(req.query.paymentId);

            if (isNaN(uid) || isNaN(paymentId)) {
                res.status(400).json({ error: 'Invalid user ID or payment ID' });
                return;
            }

            const payment = await this.paymentService.getPaymentByIdForUser(paymentId, uid);
            res.status(200).json(payment);
        } catch (error: any) {
            LOG('Error fetching payment', true, error);
            res.status(404).json({ error: error.message || 'Payment not found' });
        }
    }
}
