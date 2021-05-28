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

router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  if (!validationResult(req).isEmpty()) {
    return res.sendStatus(400);
  }
  const data = await Transaction.findOne(
    {
      _id: req.params.id,
      userId: req.session.user,
    },
    {
      name: 1,
      comments: 1,
      amount: 1,
      date: 1,
      type: 1,
      category: 1,
    },
  ).exec();
  res.send(data);
});

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
  const { id } = req.params;
  if (!isMongoId(id)) {
    return res.sendStatus(404);
  }

  const maybeTransaction = await Transaction.findOne(
    { _id: id, userId: req.session.user },
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

router.post(
  '/organize',
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    let sort = {};
    let filter = {};
    if (req.body.sortBy !== undefined) {
      sort = req.body.sortBy === 'date' ? { date: -1 } : { amount: -1 };
    }
    if (
      req.body.filterBy !== undefined &&
      req.body.filterSelection !== undefined
    ) {
      filter =
        req.body.filterBy === 'category'
          ? { category: req.body.filterSelection }
          : { type: req.body.filterSelection };
    }
    const list = await Transaction.find(
      { userId: req.session.user, ...filter },
      {
        name: 1,
        comments: 1,
        amount: 1,
        date: 1,
        type: 1,
        category: 1,
      },
      { sort: sort },
    ).exec();

    res.send(list);
  },
);

export default router;
