import { NextFunction, Request, Response } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).send({});
};

export default isAuthenticated;
