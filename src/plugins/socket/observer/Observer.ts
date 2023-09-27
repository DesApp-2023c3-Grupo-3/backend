import { Subject } from './Subject';

export interface Observer {
  id: number;
  // Receive update from subject.
  update(subject: Subject): void;
}

export class ScreenObserver implements Observer {
  id: number;
  ws: WebSocket;

  constructor({ id, ws }) {
    this.id = id;
    this.ws = ws;
  }

  public update(subject: Subject): void {
    this.ws.send(
      JSON.stringify({
        id: -1,
        topic: 'advertising',
        data: 'ESTE ES UN MENSAJE DE PRUEBA',
      }),
    );
    console.log(`Screen ${this.id} Notificated`);
  }
}
