import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import isMongoId from 'validator/lib/isMongoId';

import isAuthenticated from '../middleware/isAuthenticated';
import Transaction, {
  expenseCategories,
  incomeCategories,
} from '../models/Transaction';

const router = Router();

router.post(
  '/add',
  body('name').isString().isLength({ min: 1 }).trim().escape(),
  body('comments').isString().trim().escape(),
  body('amount').isNumeric(),
  body('date').isString().isISO8601(),
  body('type')
    .isString()
    .custom((value) => {
      if (!['income', 'expense'].includes(value)) throw new Error();
      return true;
    }),
  body('category')
    .isString()
    .custom((value, { req }) => {
      if (
        (req.body.type === 'income' && !incomeCategories.includes(value)) ||
        (req.body.type === 'expense' && !expenseCategories.includes(value))
      )
        throw new Error();
      return true;
    }),
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }

    const body = {
      name: req.body.name,
      comments: req.body.comments,
      amount: req.body.amount,
      date: req.body.date,
      type: req.body.type,
      category: req.body.category,
    };
    if (req.body.id === undefined) {
      await Transaction.create({ ...body, userId: req.session.user });
    } else if (isMongoId(req.body.id)) {
      const filter = { _id: req.body.id, userId: req.session.user };
      await Transaction.findOneAndUpdate(filter, body);
    }
    res.sendStatus(200);
  },
);

router.post(
  '/delete',
  body('id').isMongoId(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    await Transaction.deleteOne({ _id: req.body.id, userId: req.session.user });
    res.sendStatus(200);
  },
);

router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  const list = await Transaction.find(
    { userId: req.session.user },
    {
      name: 1,
      comments: 1,
      amount: 1,
      date: 1,
      type: 1,
      category: 1,
    },
  ).exec();

  res.send(list);
});

router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  const maybeTransaction = await Transaction.findOne(
    { _id: req.params.id, userId: req.session.user },
    {
      name: 1,
      comments: 1,
      amount: 1,
      date: 1,
      type: 1,
      category: 1,
    },
  ).exec();

  if (maybeTransaction !== null) {
    res.send(maybeTransaction);
  } else {
    res.sendStatus(404);
  }
});

export default router;
