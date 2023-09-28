export interface Observer {
  id: number;

  update(topic: string, data: any): void;
}

export class ScreenObserver implements Observer {
  id: number;
  ws: WebSocket;

  constructor({ id, ws }) {
    this.id = id;
    this.ws = ws;
  }

  public update(topic: string, data: any): void {
    this.ws.send(
      JSON.stringify({
        id: -1,
        topic,
        data,
      }),
    );
    console.log(`Screen ${this.id} Notificated`);
  }
}
