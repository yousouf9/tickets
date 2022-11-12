import {Message} from 'node-nats-streaming'
import {Listener, OrderCancelledEvent, Subjects} from '@ibee_common/common'
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/TicketModel';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   subject: Subjects.OrderCancelled= Subjects.OrderCancelled;
   
   queueGroupName = queueGroupName

   async onMessage(data: OrderCancelledEvent['data'], oldMessageObject: Message){
     const ticket = await Ticket.findById(data.ticket.id);

     if(!ticket){
      throw new Error('Ticket not found')
     }

     ticket.set({orderId: undefined});
     await ticket.save();

   console.log("ticket", ticket);

    await  new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userID,
        version: ticket.version,
        orderId: ticket.orderId
     })
     
     oldMessageObject.ack();
   }
}