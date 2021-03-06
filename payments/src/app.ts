import express from 'express';
import 'express-async-errors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@thelarsson/common344343';

import { createChargeRouter } from './routes/new';

const app = express();

// tell express to trusts traffic behind a proxy.
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false //process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
