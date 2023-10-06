import { Inject, Injectable } from '@nestjs/common';
import { SocketConnectionModule } from './socketConnection.module';
import { advertisingMessageDto } from './dto/advertisingMessage.dto';
import { courseMessageDto } from './dto/courseMessage.dto';

@Injectable()
export class SocketService {
  constructor(
    @Inject(SocketConnectionModule)
    private readonly socketConnectionModule: SocketConnectionModule,
  ) {}

  public async sendMessage(
    topic: string,
    data: advertisingMessageDto | courseMessageDto,
  ): Promise<any> {
    try {
      const sector =
        this.socketConnectionModule.sectors.find((sectorSubject) => {
          sectorSubject.data.topic === topic; // TODO: Revisar si esto anda
        }) || this.socketConnectionModule.sectors[0];
      console.log({ sector });
      sector.notify(topic, data);
    } catch (error) {
      console.error('SEND_MESSAGE ERROR: ', error);
    }
  }
}
