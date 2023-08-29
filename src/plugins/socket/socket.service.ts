import { Injectable } from '@nestjs/common';
import { SocketConnectionModule } from './socketConnection.module';

@Injectable()
export class SocketService {
  constructor(
    private readonly socketConnectionModule: SocketConnectionModule,
  ) { }

  public async sendMessage(topic: string, data: string): Promise<any> {
    try {
      // TODO: Revisar caso de multiples conecciones inactivas o caidas
      this.socketConnectionModule.socketConnections.forEach(sc => {
        sc.send(JSON.stringify({
          id: Math.floor(Math.random() * 100), // TODO: Mejorar este ID
          topic,
          data
        }));
      });
    } catch (error) {
      console.log('should not send message and throw exception');
    }
  }
}
