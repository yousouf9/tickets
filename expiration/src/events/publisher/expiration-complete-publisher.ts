import { Publisher, ExpirationCompleteEvent, Subjects } from "@ibee_common/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.expirationComplete = Subjects.expirationComplete
}

