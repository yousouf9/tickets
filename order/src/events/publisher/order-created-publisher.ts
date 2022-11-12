import {Publisher, OrderCreatedEvent, Subjects} from '@ibee_common/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
