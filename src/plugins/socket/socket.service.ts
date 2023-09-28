import { Injectable } from '@nestjs/common';
import { SocketConnectionModule } from './socketConnection.module';
import { advertisingMessageDto } from './dto/advertisingMessage.dto';
import { courseMessageDto } from './dto/courseMessage.dto';

@Injectable()
export class SocketService {
  constructor(
    private readonly socketConnectionModule: SocketConnectionModule,
  ) {}

  public async sendMessage(
    topic: string,
    data: advertisingMessageDto | courseMessageDto,
  ): Promise<any> {
    try {
      // TODO: Revisar caso de multiples conecciones inactivas o caidas
      this.socketConnectionModule.socketConnections.forEach(({ webSocket }) => {
        const id = Math.floor(Math.random() * 100); // TODO: Mejorar este ID
        webSocket.send(
          JSON.stringify({
            id,
            topic,
            data,
          }),
        );
        console.info(`Message ${id} sended successfully`);
      });
    } catch (error) {
      console.log('should not send message and throw exception');
    }
  }
}
