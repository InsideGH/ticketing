/// <reference types="@types/node" />

import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// stan is nats backwards, it's a client
// client id is 123
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName('order-service');
  const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options);
  // const subscription = stan.subscribe('ticket:created', options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
