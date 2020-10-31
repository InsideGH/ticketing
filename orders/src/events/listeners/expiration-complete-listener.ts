import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from '@thelarsson/common344343';
import { queueGroupName } from './queue-group-name';

import { Order } from '../../models/order';

import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  /**
   * Only one listener in the group gets the event.
   */
  queueGroupName = queueGroupName;

  /**
   * We reference the data property of the interface.
   *
   * We need the 'ack' method in msg.
   */
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;

    /**
     * Note, the id must be specified to have consistent data replication between ticket and order service.
     */
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status == OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
