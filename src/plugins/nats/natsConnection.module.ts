import { Global, Module } from '@nestjs/common';

import { connect, Msg, NatsConnection, NatsError } from 'nats';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class NatsConnectionModule {
  public natsConnection: NatsConnection;
  constructor() {
    this.initializeNatsConnection();
  }

  private async initializeNatsConnection() {
    this.natsConnection = await connect({ 'servers': ['nats://localhost:4222'] })
    this.makeSubscription('course');
    this.makeSubscription('image');
  }

  private makeSubscription(topic: string) {
    this.natsConnection.subscribe(topic, {
      callback: this.recepitMessage
    });
    console.log(`Listening on ${topic}...`);
  }

  private recepitMessage(error: NatsError, message: Msg): void {
    console.log(`${message.subject} | ${message.data}`);
  }
}
