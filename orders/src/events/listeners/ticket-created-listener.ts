import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@thelarsson/common344343';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

/**
 * To avoid having to do a sync request towards the ticket service, asking
 * for ticket details, we duplicated the ticket information into the order service
 * database.
 *
 * We must make sure to have consistent id's between replicated data.
 */
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  /**
   * Only one listener in the group gets the event.
   */
  queueGroupName = queueGroupName;

  /**
   * We reference the data property of the interface.
   *
   * We need the 'ack' method in msg.
   */
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`[${msg.getSequence()}] message received ${this.subject} / ${this.queueGroupName}`);
    console.log(`[${msg.getSequence()}] event: `, data);
    const { id, title, price } = data;

    /**
     * Note, the id must be specified to have consistent data replication between ticket and order service.
     */
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
