import {
  Router,
  Request,
  Response
} from 'express'
import {requireAuth, validateRequest} from '@ibee_common/common';
import {body} from 'express-validator';

import {Ticket} from '../models/TicketModel'


const router =  Router();


router.get('/', async(req: Request, res: Response) => {
   
  const ticket = await Ticket.find({orderId: undefined});

  res.status(200).send(ticket);
})


export { router as fetchTickets}