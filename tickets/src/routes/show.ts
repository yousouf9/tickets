import {
  Router,
  Request,
  Response
} from 'express'
import {NotFoundError, requireAuth, validateRequest} from '@ibee_common/common';
import {validationResult, body} from 'express-validator';

import {Ticket} from '../models/TicketModel'

const router =  Router();

router.get('/:id', async (req:Request, res: Response) => {
  
  const ticket = await Ticket.findById(req.params.id)
  if(!ticket)
   throw new NotFoundError()
  
  res.status(200).send(ticket);
})


export {router as TicketRouter}
