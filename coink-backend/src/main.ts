import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { exit } from 'process';

dotenv.config({ path: '.env.development' });
if (!process.env.MONGODB_URI) {
  console.error('No MongoDB connection specified');
  exit(1);
}
const mongoUrl = process.env.MONGODB_URI;

import authRouter from './routers/auth';

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

const app = express();
const port = 3000;

// Bodyparser middleware
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSIONS_SECRET || '',
    store: MongoStore.create({ mongoUrl }),
    resave: false,
    saveUninitialized: true,
  }),
);

app.use('/api/auth', authRouter);

(async () => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => {
    console.log(`coink server listening at http://localhost:${port}`);
    console.log(`connecting to database on ${mongoUrl}`);
  });
})();
