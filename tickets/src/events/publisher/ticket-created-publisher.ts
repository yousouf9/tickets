import {Publisher, TicketCreatedEvent, Subjects} from '@ibee_common/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
}