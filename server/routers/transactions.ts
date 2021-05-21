import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import Transaction from '../models/Transaction';

import isAuthenticated from '../middleware/isAuthenticated';

const router = Router();

router.post('/add', isAuthenticated, async (req: Request, res: Response) => {
  if (req.body.id === undefined) {
    const newTrans = await Transaction.create({
      name: req.body.name,
      userId: req.session.user,
      comments: req.body.comments,
      amount: req.body.amount,
      date: req.body.date,
      type: req.body.type,
      category: req.body.category,
    });
    res.sendStatus(200);
  } else {
    const trans = await Transaction.findOneAndUpdate(
      { _id: req.body.id, userId: req.session.user },
      {
        name: req.body.name,
        comments: req.body.comments,
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        category: req.body.category,
      },
    );
    res.sendStatus(200);
  }
});

router.post(
  '/delete',
  body('id').isString(),
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    await Transaction.deleteOne({ _id: req.body.id });
    res.sendStatus(200);
  },
);
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  const list = await Transaction.find(
    { userId: req.session.user },
    {
      _id: -1,
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
export default router;
