import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// tiny request logger -- enough for dev/demo debugging without pulling in
// a logging dependency for a project this size
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/v1', router);

app.use(notFound);
app.use(errorHandler);
