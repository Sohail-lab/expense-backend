import { Request, Response } from 'express';
import { TransactionService } from '../../application/services/TransactionService.js';
import { LOG } from '../../infrastructure/database/helper.js';
import { TxnData } from '../../domain/types/txnData.js';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    /**
     * Get transactions for a group and user
     */
    async getTransactionsByGroup(req: Request, res: Response): Promise<void> {
        try {
            const uid = Number(req.query.uid);
            const groupId = Number(req.query.groupId);

            if (isNaN(uid) || isNaN(groupId)) {
                res.status(400).json({ error: 'Invalid user ID or group ID' });
                return;
            }

            const rows = await this.transactionService.getTransactionsByGroupForUser(groupId, uid);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG('Error fetching transactions', true, error);
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    }

    /**
     * Create a new transaction
     */
    async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const txnData: TxnData = req.body;

            const result = await this.transactionService.createTransaction(txnData);
            res.status(201).json(result);
        } catch (error: any) {
            LOG('Error creating transaction', true, error);
            res.status(400).json({ error: error.message || 'Failed to create transaction' });
        }
    }
}
