import { Inject, Injectable } from '@nestjs/common';
import { SocketConnectionModule } from './socketConnection.module';
import { MessageDto } from './dto/Message.dto';

@Injectable()
export class SocketService {
  constructor(
    @Inject(SocketConnectionModule)
    private readonly socketConnectionModule: SocketConnectionModule,
  ) {}

  public async sendMessage(topic: string, data: MessageDto): Promise<void> {
    try {
      const sectorsFound = this.socketConnectionModule.sectors.filter(
        (sectorSubject) => {
          return sectorSubject.data.topic === topic;
        },
      ) || [this.socketConnectionModule.sectors[0]];
      sectorsFound.map((sector) => {
        sector.notify(data);
      });
    } catch (error) {
      console.error('SEND_MESSAGE ERROR: ', error);
    }
  }
}
