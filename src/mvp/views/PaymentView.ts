import { Request, Response } from 'express';
import { PaymentModel } from '../models/PaymentModel.js';
import { PaymentPresenter } from '../presenters/PaymentPresenter.js';

const paymentPresenter = new PaymentPresenter(new PaymentModel());

export const paymentView = {
    getPaymentsForTransactionAndUser: async (req: Request, res: Response) => {
        try {
            const txnId = Number(req.query.id);
            const uid = Number(req.query.uid);
            const rows = await paymentPresenter.getPaymentsForTransactionAndUser(txnId, uid);
            res.status(200).json(rows);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    },

    getPaymentByIdForUser: async (req: Request, res: Response) => {
        try {
            const uid = Number(req.params.uid);
            const paymentId = Number(req.query.paymentId);
            const payment = await paymentPresenter.getPaymentByIdForUser(paymentId, uid);
            res.status(200).json(payment);
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Payment not found' });
        }
    }
};
