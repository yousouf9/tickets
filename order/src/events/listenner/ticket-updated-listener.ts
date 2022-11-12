
import {Listener, TicketUpdatedEvent, Subjects} from '@ibee_common/common'
import { Message } from 'node-nats-streaming';
import {Ticket} from '../../models/TicketModel'
import {queueGroupName} from './queue-group-name'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
 async onMessage(data: TicketUpdatedEvent['data'], oldMessageObject: Message){

   const ticket = await Ticket.findByEvent(data);

   if(!ticket){
    throw new Error('Ticket not found');
   }

   

   const {title, price, version}  = data;
    
   ticket.set({
    title,
    price,
    version,
   })

   console.log("ticket updated", ticket);

   await ticket.save();
   oldMessageObject.ack();
  }

}