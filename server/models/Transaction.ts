import mongoose, { Document, Schema } from 'mongoose';

type TransactionType = Income | Expense;
type IncomeCategory = 'bonus' | 'salary' | 'sale' | 'other';
type ExpenseCategory =
  | 'bills'
  | 'food'
  | 'clothes'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'other';

interface Transaction extends Document {
  name: string;
  userId: string;
  comments: string;
  amount: number;
  date: Date;
}

interface Income extends Transaction {
  type: 'income';
  category: IncomeCategory;
}

interface Expense extends Transaction {
  type: 'expense';
  category: ExpenseCategory;
}

const transactionSchema = new Schema<TransactionType>({
  type: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  comments: { type: String, required: false },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Transaction = mongoose.model<TransactionType>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
