import {Publisher,  TicketUpdatedEvent, Subjects} from '@ibee_common/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
}
