import { Publisher, PaymentCreatedEvent, Subjects } from "@ibee_common/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated
}