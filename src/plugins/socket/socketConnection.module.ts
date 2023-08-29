import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { WebSocketServer, WebSocket } from 'ws';

import serverConfig from '../../config/server.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(serverConfig)],
  providers: [],
  exports: [],
})
export class SocketConnectionModule {
  public socketServer: WebSocketServer;
  public socketConnections: WebSocket[] = [];
  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfiguration: ConfigType<typeof serverConfig>,
  ) {
    this.initializeSocketConnection();
  }

  private async initializeSocketConnection() {
    const PORT = this.serverConfiguration.socket.port;
    this.socketServer = new WebSocketServer({ port: PORT });
    this.socketServer.on('connection', (ws) => {
      ws.on('message', (data) => {
        console.log(`Recived message: ${data}`);
      });

      ws.send(JSON.stringify({ id: -1, data: 'Hello! This is the server' }));
      this.socketConnections.push(ws);
    });

    console.info(`Socket server connected on port ${PORT}...`);
  }
}
