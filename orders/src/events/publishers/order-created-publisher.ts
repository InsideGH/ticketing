import { Publisher, OrderCreatedEvent, Subjects } from '@thelarsson/common344343';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
