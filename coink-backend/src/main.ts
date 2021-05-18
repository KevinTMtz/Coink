import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: '.env.development' });

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`coink server listening at http://localhost:${port}`);
  console.log(`connecting to mongodb on ${process.env.MONGODB_URI}`);
});
