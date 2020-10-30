import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@thelarsson/common344343';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 999,
    title: 'new concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
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
    ticket,
    data,
    msg,
  };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
