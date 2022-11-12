import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session';
import {json} from 'body-parser'


import {currentUser, errorHandler, NotFoundError} from '@ibee_common/common'


import {paymentRouter} from './routes/new';


const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed:false,
  secure: process.env.NODE_ENV !== 'test'
}))

//set current user session
app.use(currentUser)

app.use('/api/payments', paymentRouter);


app.use('*', (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }