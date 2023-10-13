import { Screen } from 'src/entities/screen.entity';
import { MessageDto } from '../dto/Message.dto';

export interface Observer {
  data: any;

  update(data: any): void;
}

export class ScreenObserver implements Observer {
  public data: Screen;
  private ws: WebSocket;

  constructor({ data, ws }) {
    this.data = data;
    this.ws = ws;
  }

  public update(data: MessageDto): void {
    this.ws.send(
      JSON.stringify({
        id: data.id,
        data,
      }),
    );
    console.info(`Screen ${this.data.id} Notificated`);
  }
}
