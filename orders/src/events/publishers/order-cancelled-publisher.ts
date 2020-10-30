import { Subjects, Publisher, OrderCancelledEvent } from '@thelarsson/common344343';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
