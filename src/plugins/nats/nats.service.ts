import { Injectable } from '@nestjs/common';
import { NatsConnectionModule } from './natsConnection.module';

@Injectable()
export class NatsService {
  constructor(
    private readonly natsConnectionModule: NatsConnectionModule,
  ) { }

  public async sendMessage(topic: string, message: string): Promise<any> {
    try {
      this.natsConnectionModule.natsConnection.publish(topic, message);
    } catch (error) {
      console.log('should not send message and throw exception');
    }
  }
}
