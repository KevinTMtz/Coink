import { Request, Response, Router } from 'express';

import isAuthenticated from '../middleware/isAuthenticated';
import Transaction from '../models/Transaction';

const router = Router();

router.get(
  '/expenses',
  isAuthenticated,
  async (req: Request, res: Response) => {
    const list = await Transaction.aggregate([
      { $match: { userId: req.session.user, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
        },
      },
    ]);
    res.send(list);
  },
);

router.get('/incomes', isAuthenticated, async (req: Request, res: Response) => {
  const list = await Transaction.aggregate([
    { $match: { userId: req.session.user, type: 'income' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        amount: { $sum: '$amount' },
      },
    },
  ]);
  res.send(list);
});

interface DataPoints {
  dates: Date[];
  incomeAmounts: number[];
  incomeCounts: number[];
  expenseAmounts: number[];
  expenseCounts: number[];
}

router.get(
  '/timeline',
  isAuthenticated,
  async (req: Request, res: Response) => {
    const today = new Date();
    const projection = {
      year: { $year: '$date' },
      month: { $month: '$date' },
      amount: 1,
      _id: 0,
    };
    const matchDates = {
      $or: [
        { year: today.getFullYear() },
        { year: today.getFullYear() - 1, month: { $gt: today.getMonth() + 1 } },
      ],
    };
    const grouping = {
      _id: '$month',
      count: { $sum: 1 },
      total: { $sum: '$amount' },
    };
    const [incomes, expenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: req.session.user, type: 'income' } },
        { $project: projection },
        { $match: matchDates },
        { $group: grouping },
      ]),
      Transaction.aggregate([
        { $match: { userId: req.session.user, type: 'expense' } },
        { $project: projection },
        { $match: matchDates },
        { $group: grouping },
      ]),
    ]);

    const datapoints = Array.from({ length: 12 }, (_, i) => 11 - i)
      .map(
        (monthDecrement) =>
          new Date(today.getFullYear(), today.getMonth() - monthDecrement, 1),
      )
      .map((date) => ({
        date,
        numIncomes:
          incomes.find((i) => i._id === date.getMonth() + 1)?.count || 0,
        totalIncome:
          incomes.find((i) => i._id === date.getMonth() + 1)?.total || 0,
        numExpenses:
          expenses.find((i) => i._id === date.getMonth() + 1)?.count || 0,
        totalExpense:
          expenses.find((i) => i._id === date.getMonth() + 1)?.total || 0,
      }))
      .reduce<DataPoints>(
        (acc, val) => ({
          dates: [...acc.dates, val.date],
          incomeCounts: [...acc.incomeCounts, val.numIncomes],
          incomeAmounts: [...acc.incomeAmounts, val.totalIncome],
          expenseCounts: [...acc.expenseCounts, val.numExpenses],
          expenseAmounts: [...acc.expenseAmounts, val.totalExpense],
        }),
        {
          dates: [],
          incomeCounts: [],
          incomeAmounts: [],
          expenseCounts: [],
          expenseAmounts: [],
        },
      );

    res.send(datapoints);
  },
);

export default router;
