export interface TxnData {
    group_id: number;
    initial_amount: number;
    description: string;
    debt_user: number;
    credit_user: number;
    remaining_amount: number;
    split_transaction: boolean;
}
