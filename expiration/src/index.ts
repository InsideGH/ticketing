import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  console.log('Starting...');
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL env variable must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID env variable must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID env variable must be defined');
  }
  try {
    /**
     * nats-depl.yaml
     * -cid ticketing (cluster id)
     */
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();

    console.log('Expiration up and running');
  } catch (error) {
    console.error(error);
  }
};

start();
