import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { connect, Msg, NatsConnection, NatsError } from 'nats';
import serverConfig from '../../config/server.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(serverConfig)],
  providers: [],
  exports: [],
})
export class NatsConnectionModule {
  public natsConnection: NatsConnection;
  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfiguration: ConfigType<typeof serverConfig>,
  ) {
    this.initializeNatsConnection();
  }

  private async initializeNatsConnection() {
    const HOST = this.serverConfiguration.nats.host;
    const PORT = this.serverConfiguration.nats.port;
    this.natsConnection = await connect({ servers: [`nats://${HOST}:${PORT}`] });
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
