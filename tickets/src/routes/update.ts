import {
  Router,
  Request,
  Response
} from 'express'
import {body} from 'express-validator';
import {
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    NotFoundError,
    BadRequestError
  } from '@ibee_common/common';
import {Ticket} from '../models/TicketModel'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { netNewWrapper } from '../nats-client';

const router =  Router();

router.put('/:id', 
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
  async(req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id);
    if(!ticket)
      throw new NotFoundError();
    if(ticket.userID !== req.currentUser?.id)
      throw new  NotAuthorizedError("you are not authorized");
    if(ticket.orderId){
     throw new BadRequestError('This ticket cannot be edited as it is reserved');
    }

    const {title, price} = req.body;
    ticket.set({
      title, price
    })
    await ticket.save();

    new TicketUpdatedPublisher(netNewWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title:ticket.title,
      userId: ticket.userID,
      version: ticket.version
    })
   res.status(200).send(ticket)
})

export {
   router as TickUpdate
}