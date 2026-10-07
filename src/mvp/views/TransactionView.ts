import { Request, Response } from 'express';
import { TransactionModel } from '../models/TransactionModel.js';
import { TransactionPresenter } from '../presenters/TransactionPresenter.js';

const transactionPresenter = new TransactionPresenter(new TransactionModel());

export const transactionView = {
    getTransactionsByGroupForUser: async (req: Request, res: Response) => {
        try {
            const uid = Number(req.query.uid);
            const groupId = Number(req.query.groupId);
            const rows = await transactionPresenter.getTransactionsByGroupForUser(groupId, uid);
            res.status(200).json(rows);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    },

    createTransaction: async (req: Request, res: Response) => {
        try {
            const result = await transactionPresenter.createTransaction(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create transaction' });
        }
    }
};
