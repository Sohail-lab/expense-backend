import { TransactionModel } from '../models/TransactionModel.js';
import { TxnData } from '../../domain/types/txnData.js';

export class TransactionPresenter {
    constructor(private model: TransactionModel) {}

    async getTransactionsByGroupForUser(groupId: number, userId: number) {
        return await this.model.getTransactionsByGroupForUser(groupId, userId);
    }

    async createTransaction(txnData: TxnData) {
        const { group_id, initial_amount, description, debt_user, credit_user } = txnData;

        if (!group_id || !initial_amount || !description || !debt_user || !credit_user) {
            throw new Error('Missing required transaction fields');
        }

        if (debt_user === credit_user) {
            throw new Error('Debt user and credit user must be different');
        }

        await this.model.createTransaction(txnData);
        return { message: 'Create transaction succeed' };
    }
}
