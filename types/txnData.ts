export type TxnData = {
    group_id: number,
    initial_amount: number,
    description: string,
    debt_user: number,
    credit_user: number,
    remaining_amount: number,
    split_transaction: boolean,
    payments_till_now: number,
    settlement_status: string,
    notification_status: string
};