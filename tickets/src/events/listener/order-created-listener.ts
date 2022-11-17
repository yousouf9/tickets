import {Message} from 'node-nats-streaming'
import {Listener, OrderCreatedEvent, Subjects} from '@ibee_common/common'
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/TicketModel';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   subject: Subjects.OrderCreated= Subjects.OrderCreated;
   
   queueGroupName = queueGroupName

   async onMessage(data: OrderCreatedEvent['data'], oldMessageObject: Message){
     const ticket = await Ticket.findById(data.ticket.id);

     if(!ticket){
      throw new Error('Ticket not found')
     }

     ticket.set({orderId: data.id});
     await ticket.save();
          

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