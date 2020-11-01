import { Subjects, Publisher, PaymentCreatedEvent } from '@thelarsson/common344343';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
