import { ITransaction } from "../models/transaction.model";

export function showMessage(message: string) {
  return {
    message: message,
  };
}

function transactionDetails(t: ITransaction) {
  return {
    transaction_id: t.transaction_id,
    group_id: t.group_id,
    initial_amount: t.initial_amount,
    description: t.description,
    debt_user: t.debt_user,
    credit_user: t.credit_user,
    remaining_amount: t.remaining_amount,
    split_transaction: t.split_transaction,
    payments_till_now: t.payments_till_now,
    settlement_status: t.settlement_status,
    notification_status: t.notification_status,
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
}

export function listTransactionDetails(transactionList: ITransaction[]) {
  return transactionList.map(transactionDetails);
}
