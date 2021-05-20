import { NextFunction, Request, Response } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

export default isAuthenticated;
