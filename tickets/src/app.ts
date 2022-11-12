import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session';
import {json} from 'body-parser'


import {currentUser, errorHandler, NotFoundError} from '@ibee_common/common'


import newTicket from './routes/new';
import {TicketRouter} from './routes/show';
import { fetchTickets } from './routes/index';
import { TickUpdate } from './routes/update';

const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed:false,
  secure: process.env.NODE_ENV !== 'test'
}))

//set current user session
app.use(currentUser)


app.use('/api/tickets', newTicket);
app.use('/api/tickets', TicketRouter);
app.use('/api/tickets', fetchTickets)
app.use('/api/tickets', TickUpdate)




app.use('*', (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }