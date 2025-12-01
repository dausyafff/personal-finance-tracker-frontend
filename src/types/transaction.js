export const Transaction = {
  id: string | number,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string, // ISO date
  createdAt: string,
  updatedAt: string,
  userId: string | number
};