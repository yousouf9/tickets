import {Publisher, Subjects, OrderCancelledEvent} from '@ibee_common/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
