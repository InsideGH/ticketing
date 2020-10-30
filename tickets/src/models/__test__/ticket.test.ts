import { Ticket } from '../ticket';

it('implements optimistic concurrent control', async (done) => {
  const ticket = Ticket.build({
    title: 'consert',
    price: 10,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set('price', 10);
  secondInstance!.set('price', 15);

  await firstInstance!.save();

  // Below does not work so good with typescript
  // expect(() => {}).toThrow();

  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
