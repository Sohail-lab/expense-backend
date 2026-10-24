export interface ITransaction {
  transaction_id: number;
  group_id: number;
  initial_amount: string;
  description: string;
  debt_user: number;
  credit_user: number;
  remaining_amount: string;
  split_transaction: boolean;
  payments_till_now: number;
  settlement_status: string;
  notification_status: string;
  created_at: string;
  updated_at: string;
}
