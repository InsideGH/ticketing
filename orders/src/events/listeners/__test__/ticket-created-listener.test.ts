import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@thelarsson/common344343';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 3434,
    title: 'concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
    getSequence: () => {
      return 1;
    },
  };

  return {
    listener,
    data,
    msg,
  };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(msg.ack).toHaveBeenCalled();
});
