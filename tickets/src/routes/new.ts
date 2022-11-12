import {
  Router,
  Request,
  Response
} from 'express'
import {requireAuth, validateRequest} from '@ibee_common/common';
import {body} from 'express-validator';
import {Ticket} from '../models/TicketModel'

import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { netNewWrapper } from '../nats-client';

const router =  Router();

router.post('/',
 requireAuth,
 [
  body('title')
  .notEmpty()
  .withMessage('title is required'),
  body('price')
   .isFloat({gt:0})
   .withMessage('price must be greater than 0')
],
  
 validateRequest,

 async (req: Request, res: Response) => {

    const {title, price} = req.body;

    const ticket = Ticket.createTicket({
      title,
      price,
      userID:req.currentUser!.id
    })
     await ticket.save();

     console.log("ticket create", ticket);
     
     new TicketCreatedPublisher(netNewWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userID,
      version: ticket.version
     })
  res.status(201).send(ticket)
})


export default router;