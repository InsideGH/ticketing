import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@thelarsson/common344343';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log(`[${msg.getSequence()}] message received ${this.subject} / ${this.queueGroupName}`);
    console.log(`[${msg.getSequence()}] event: `, data);

    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({
      // version: data.version,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
