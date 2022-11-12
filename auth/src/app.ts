import express from 'express';
import 'express-async-errors'

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import currentUserRouter from './routes/current-user';
import signInRouter from './routes/signin';
import signOutRouter from './routes/signout';
import signUpRouter from './routes/signup';

import {errorHandler, NotFoundError} from '@ibee_common/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false, //don't encryt cookies as we are using jwt
  secure: process.env.NODE_ENV !== 'test'//send cookies over HTTPS only
}))

app.use('/api/users', currentUserRouter);
app.use('/api/users', signInRouter);
app.use('/api/users', signOutRouter);
app.use('/api/users', signUpRouter);

app.use('*', (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler);


export {app};