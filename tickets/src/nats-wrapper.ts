import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // This property might be undefined for a while.
  private _client?: Stan;

  /**
   * Typescript getter.
   *
   * Accessed from outside/inside like so: natsWrapper.client
   */
  get client() {
    if (!this._client) {
      throw new Error('Cannot access Nats client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to Nats');
        resolve(this._client);
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
