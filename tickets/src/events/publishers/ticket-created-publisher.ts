import { Publisher, TicketCreatedEvent, Subjects } from '@thelarsson/common344343';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // Both to make sure that we never can change this value in the future.
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
