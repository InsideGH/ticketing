/// <reference types="@types/node" />

import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    console.log("###client", client);
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    console.log("###client:::", this.client);

    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        return resolve();
      });
    });
  }
}
