import { Listener, OrderCreatedEvent, Subjects } from '@thelarsson/common344343';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queue/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id } = data;

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log('waiting delay processing', delay);

    await expirationQueue.add(
      {
        orderId: id,
      },
      {
        delay,
      },
    );

    msg.ack();
  }
}
