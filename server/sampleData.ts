import Transaction, {
  expenseCategories,
  incomeCategories,
} from './models/Transaction';

const getRandomCategory = (type: string) => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories[Math.floor(Math.random() * categories.length)];
};

export const createSampleData = async (userId: string) => {
  const today = new Date();
  const dates = Array.from({ length: 12 }, (_, i) => 11 - i).map(
    (monthDecrement) =>
      new Date(
        today.getFullYear(),
        today.getMonth() - monthDecrement,
        Math.random() * 28,
      ),
  );
  const transactions = dates
    .flatMap((date) =>
      Array.from({ length: Math.floor(10 * Math.random()) }, (_, i) =>
        Math.random() > 0.5
          ? { date, type: 'income' }
          : { date, type: 'expense' },
      ),
    )
    .map((obj, i) => ({
      ...obj,
      userId,
      name: `Transaction ${i}`,
      category: getRandomCategory(obj.type),
      amount: Math.random() * 1000,
    }));
  await Transaction.insertMany(transactions);
  console.log(`Generated ${transactions.length} sample transactions`);
};
