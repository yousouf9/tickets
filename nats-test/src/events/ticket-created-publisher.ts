import {Publisher} from './base-publisher'
import {TicketCreated} from './ticket-created-event';
import {Subjects} from './subject';

export class TicketCreatedPublisher extends Publisher<TicketCreated>{
     
  readonly subject  = Subjects.TicketCreated;

}
