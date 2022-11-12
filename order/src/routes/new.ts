import {Request, Response, Router} from 'express';
import mongoose from 'mongoose';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@ibee_common/common';
import {body} from 'express-validator'
import { Ticket } from '../models/TicketModel';
import { Order } from '../models/OrderModel';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { netNewWrapper } from '../nats-client';

const router =  Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/', 
  requireAuth,
  [
    body('ticketId')
      .trim()
      .not()
      .isEmpty()
      .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
      .withMessage('vlaid ticketId must be provided')
  ],
  validateRequest,
  async(req:Request, res:Response) => {

  const {ticketId} = req.body;

  //Check if ticket exist
  const ticket = await Ticket.findById(ticketId);

  console.log("ticket value", ticket);
  
  if(!ticket)throw new NotFoundError();

  //checkt if ticket has been reserved
  const isReserved = await ticket.isReserved()
  if(isReserved){
    throw new BadRequestError('Ticket is already reserved');
  }

  //Creating an expirations time in seconds
  const expirationTime = new Date();
  expirationTime.setSeconds(expirationTime.getSeconds() + EXPIRATION_WINDOW_SECONDS);


  //creating the order
  const order = Order.createOrder({
       userId: req.currentUser!.id,
       status: OrderStatus.Created,
       expiresAt: expirationTime,
       ticketId: ticket.id
  })

  await order.save();

  //TODO publish the order even
  new OrderCreatedPublisher(netNewWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    version:order.version,
    ticket:{
      id:ticket.id,
      price: ticket.price
    }
  })


   res.status(201).send(order);
})


export {router as createOrders}