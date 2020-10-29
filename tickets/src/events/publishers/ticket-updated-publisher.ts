import { Publisher, TicketUpdatedEvent, Subjects } from '@thelarsson/common344343';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  // Both to make sure that we never can change this value in the future.
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated ;
}
