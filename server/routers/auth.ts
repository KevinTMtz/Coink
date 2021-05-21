import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/User';

const router = Router();

router.post(
  '/login',
  body('email').isString(),
  body('password').isString(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.sendStatus(400);
    }
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user === null) {
      return res.send({ error: 'No existe una cuenta con ese correo' });
    }
    const passwordsMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!passwordsMatch) {
      return res.send({ error: 'Contraseña incorrecta' });
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
      return res.send({ error: 'Ya existe una cuenta con ese correo' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    req.session.user = newUser.id;
    res.redirect('/dashboard');
  },
);

router.get('/logout', async (req: Request, res: Response) => {
  await new Promise<void>((resolve, reject) =>
    req.session.destroy((err) => (err ? reject(err) : resolve())),
  );
  res.redirect('/login');
});

export default router;
