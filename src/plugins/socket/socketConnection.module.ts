import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { WebSocketServer, WebSocket } from 'ws';

import serverConfig from '../../config/server.config';
import { SectorSubject } from './observer/Subject';
import { ScreenObserver } from './observer/Observer';
import { ScreenModule } from 'src/resources/screen/screen.module';
import { ScreenService } from 'src/resources/screen/screen.service';
import { SectorModule } from 'src/resources/sector/sector.module';
import { SectorService } from 'src/resources/sector/sector.service';

@Module({
  imports: [ConfigModule.forFeature(serverConfig), ScreenModule, SectorModule],
  providers: [],
  exports: [],
})
export class SocketConnectionModule {
  public socketServer: WebSocketServer;
  // public socketConnections: { sectorId: number; webSocket: WebSocket }[] = [];
  public sectors: SectorSubject[];

  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfiguration: ConfigType<typeof serverConfig>,
    @Inject(ScreenService)
    private readonly screenService: ScreenService,
    @Inject(SectorService)
    private readonly sectorService: SectorService,
  ) {
    console.log('por inicializar');
    this.initializeSocketConnection();
  }

  private async initializeSocketConnection() {
    const PORT = this.serverConfiguration.socket.port;
    this.socketServer = new WebSocketServer({ port: PORT });
    this.socketServer.on('connection', this.makeConnection);

    console.info(`Socket server connected on port ${PORT}...`);
  }

  private async makeConnection(ws: WebSocket) {
    ws.on('message', async (message) => {
      const data = JSON.parse(String(message));
      console.log(`Recived message: ${data.message}`);

      try {
        console.log('SCREENID | data.screenId |', data.screenId);
        console.log(this.screenService); // TODO: ACA ME LLEGA UNDEFINED
        console.log(this.sectorService); // TODO: ACA ME LLEGA UNDEFINED
        let screenFound = await this.screenService.findOne(data.screenId);
        console.log('SCREEN FOUND |', screenFound);
        if (!screenFound) {
          console.log('Creating new screen');
          screenFound = await this.screenService.create({}); // TODO: Crear el default
          console.log('new screen created', screenFound);
        }
        const sectorFound = await this.sectorService.findOne(
          screenFound.sector.id,
        );
        console.log('SECTOR FOUND |', sectorFound);
        if (!sectorFound) {
          console.error('ERROR ON CONNECTION');
        }
        let sectorSubject = this.sectors.find(
          (sector) => sector.data.id === sectorFound.id,
        );
        console.log('SECTOR SUBJECT FOUND |', sectorSubject);
        if (!sectorSubject) {
          console.log('Creating new sector subject');
          sectorSubject = new SectorSubject({
            data: sectorFound,
          });
          console.log('new sector subject created', sectorSubject);
          this.sectors.push(sectorSubject);
        }
        if (!sectorSubject.contains(screenFound.id)) {
          console.log('IF Sector Subject Not contains screen');
          console.log('create new screen observer');
          const screenObserver = new ScreenObserver({ id: screenFound.id });
          console.log('new screen observer created');
          sectorSubject.attach(screenObserver);
        }

        ws.send(
          JSON.stringify({
            id: -1,
            topic: 'connection',
            data: 'Hello! This is the server',
          }),
        );
      } catch (error) {
        console.log('asdasdasdasda');
      }
    });
  }
}
