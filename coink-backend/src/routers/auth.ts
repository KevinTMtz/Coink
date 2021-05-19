import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/User';

const router = Router();

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user === null) {
      return res.sendStatus(404);
    }
    const passwordsMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!passwordsMatch) {
      return res.send('Invalid credentials');
    }
    req.session.user = user.id;
    res.redirect('/dashboard');
  },
);

router.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user !== null) {
      return res.send('An account with that email already exists');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  },
);

export default router;
