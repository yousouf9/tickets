import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session';
import {json} from 'body-parser'


import {currentUser, errorHandler, NotFoundError} from '@ibee_common/common';


import {fetchAllOrders} from './routes';
import {deleteOrder} from './routes/delete';
import {createOrders} from './routes/new';
import {showOrders} from './routes/show';


const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed:false,
  secure: process.env.NODE_ENV !== 'test'
}))

//set current user session
app.use(currentUser)


app.use('/api/orders', fetchAllOrders);
app.use('/api/orders', createOrders);
app.use('/api/orders', deleteOrder);
app.use('/api/orders', showOrders);



app.use('*', (req, res) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }