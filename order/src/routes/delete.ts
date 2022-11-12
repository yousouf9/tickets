import { NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ibee_common/common';
import {Request, Response, Router} from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { Order } from '../models/OrderModel';
import { netNewWrapper } from '../nats-client';

const router =  Router();

router.delete('/:orderID', 
requireAuth,
[
  param('orderID')
    .trim()
    .not()
    .isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage('valid ticketId must be provided')
],
validateRequest,
async (req:Request, res:Response) => {
  
const order = await Order.
                          findOne(
                            {
                              userId: req.currentUser!.id,
                              _id:req.params.orderID
                            }
                          )
                          .populate({
                            path: 'ticketId'
                          })
  
  if(!order){
    throw new NotFoundError();
  }
     
  order.status = OrderStatus.Cancelled
  await order.save();
  
  //Todo publish an event to update order status
  const publisher = new OrderCancelledPublisher(netNewWrapper.client);
  publisher.publish({
    id: order.id,
    version: order.version,
    ticket:{
      id:order.ticketId?.id
    }
  })

  res.status(204).send(order)
})


export {router as deleteOrder}