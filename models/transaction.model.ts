export interface ITransaction {
  id: number;
  userId: number;
  amount: number;
  category: string;
  note?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}