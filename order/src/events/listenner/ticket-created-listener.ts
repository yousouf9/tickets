
import {Listener, TicketCreatedEvent, Subjects} from '@ibee_common/common'
import { Message } from 'node-nats-streaming';
import {Ticket} from '../../models/TicketModel'
import {queueGroupName} from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

 async onMessage(data: TicketCreatedEvent['data'], oldMessageObject: Message){
   const {id, title, price}  = data;
   const ticket =  Ticket.createTicket({
     title,
     price,
     id
   })

   await ticket.save(); 

   console.log("ticket created", ticket);
   oldMessageObject.ack();
  }

}