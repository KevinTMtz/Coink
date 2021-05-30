import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import next from 'next';
import mongoose from 'mongoose';
import { exit } from 'process';

dotenv.config({ path: '.env.development' });
if (!process.env.MONGODB_URI) {
  console.error('No MongoDB connection specified');
  exit(1);
}
const mongoUrl = process.env.MONGODB_URI;
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '', 10) || 3000;

import authRouter from './routers/auth';
import transRouter from './routers/transactions';
import statsRouter from './routers/stats';
// TODO: Delete import
import { createSampleData } from './sampleData';

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  await Promise.all([
    mongoose
      .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log(`connected to database on ${mongoUrl}`)),
    app.prepare().then(() => console.log('next.js server ready')),
  ]);
  mongoose.set('useFindAndModify', false);

  // TODO: Delete after tests
  // await createSampleData(userId);

  const server = express();

  // Bodyparser middleware
  server.use(express.json());

  // Session middleware
  server.use(
    session({
      secret: process.env.SESSIONS_SECRET || '',
      store: MongoStore.create({ mongoUrl }),
      resave: false,
      saveUninitialized: true,
    }),
  );

  // Authentication router
  server.use('/api/auth', authRouter);

  // Transactions router
  server.use('/api/transaction', transRouter);

  // Statistics router
  server.use('/api/stats', statsRouter);

  // Handle routes with next.js
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`coink server listening at http://localhost:${port}`);
  });
})();
