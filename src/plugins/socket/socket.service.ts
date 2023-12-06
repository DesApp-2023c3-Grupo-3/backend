import { Inject, Injectable } from '@nestjs/common';
import { SocketConnectionModule } from './socketConnection.module';
import { MessageDto } from './dto/Message.dto';

@Injectable()
export class SocketService {
  constructor(
    @Inject(SocketConnectionModule)
    private readonly socketConnectionModule: SocketConnectionModule,
  ) {}

  private getSectors(topic: string) {
    console.log(this.socketConnectionModule.sectors);
    return (
      this.socketConnectionModule.sectors.filter((sectorSubject) => {
        return sectorSubject.data.topic === topic;
      }) || [this.socketConnectionModule.sectors[0]]
    );
  }

  public async sendMessage(topic: string, data: MessageDto): Promise<void> {
    try {
      const sectorsFound = this.getSectors(topic);
      sectorsFound.map((sector) => {
        sector.notify(data);
      });
    } catch (error) {
      console.error('SEND_MESSAGE ERROR: ', error);
    }
  }

  public async sendSubscriptionMessage(
    topic: string,
    subscription: string,
    data: MessageDto,
  ): Promise<void> {
    try {
      console.log('estoy en el send message');
      const sectorsFound = this.getSectors(topic);
      console.log(sectorsFound);
      sectorsFound.map((sector) => {
        sector.notifySubscription(subscription, data);
      });
    } catch (error) {
      console.error('SEND_SUBSCRIPTION_MESSAGE ERROR: ', error);
    }
  }

  unsubscribe(topic: string, id: number) {
    const sectorsFound = this.getSectors(topic);
    sectorsFound.map((sector) => {
      console.log('estoy dentro de unsubscribe', sector, id);
      sector.detach(id);
    });
  }
}
