import {Message} from 'node-nats-streaming'
import { Listener } from "./base-listener";
import { Subjects } from './subject';
import {TicketCreated} from './ticket-created-event'


export class TicketCreatedListener extends Listener<TicketCreated>{
  readonly queueGroupName = 'Ticket-service-name';
  readonly subject = Subjects.TicketCreated;

 onMessage(data: TicketCreated['data'], msg: Message){
   console.log("You received the data", data);

   msg.ack();
 }
}
