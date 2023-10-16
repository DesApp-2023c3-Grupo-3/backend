import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { WebSocketServer, WebSocket } from 'ws';

import serverConfig from '../../config/server.config';
import { SectorSubject } from './observer/Subject';
import { ScreenObserver } from './observer/Observer';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from 'src/entities/sector.entity';
import { Screen } from 'src/entities/screen.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forFeature(serverConfig),
    TypeOrmModule.forFeature([Screen, Sector]),
  ],
  providers: [],
  exports: [SocketConnectionModule],
})
export class SocketConnectionModule {
  public socketServer: WebSocketServer;
  public sectors: SectorSubject[] = [];

  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfiguration: ConfigType<typeof serverConfig>,
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {
    this.initializeSocketConnection();
  }

  private async initializeSocketConnection() {
    const PORT = this.serverConfiguration.socket.port;
    this.socketServer = new WebSocketServer({ port: PORT, path: '/messaging' });
    this.socketServer.on('connection', this.makeConnection.bind(this));
    console.info(`Socket server connected on port ${PORT}...`);
  }

  private async makeConnection(ws: WebSocket) {
    ws.on('message', async (message) => {
      const data = JSON.parse(String(message));
      try {
        let screenFound = await this.screenRepository.findOne({
          where: { id: data.screenId },
          relations: { sector: true },
        });
        if (!screenFound) {
          const newScreen = this.screenRepository.create({
            subscription: data.screenId,
            templeteId: '1',
            courseIntervalTime: 15,
            advertisingIntervalTime: 15,
            sector: await this.sectorRepository.findOne({ where: { id: 1 } }),
          });
          screenFound = await this.screenRepository.save(newScreen);
        }
        const sectorFound = await this.sectorRepository.findOne({
          where: { id: screenFound.sector.id },
        }); // TODO: Revisar si esto es necesario
        if (!sectorFound) {
          console.error('ERROR ON CONNECTION');
        }
        let sectorSubject = this.sectors.find(
          (sector) => sector.data.id === sectorFound.id,
        );
        if (!sectorSubject) {
          sectorSubject = new SectorSubject({
            data: sectorFound,
          });
          this.sectors.push(sectorSubject);
        }
        if (sectorSubject.contains(screenFound.id)) {
          sectorSubject.detach(screenFound.id);
        }
        const screenObserver = new ScreenObserver({
          data: screenFound,
          ws,
        });
        sectorSubject.attach(screenObserver);

        screenObserver.update({
          id: -1,
          action: 'START_CONNECTION',
          data: {
            sector: sectorFound,
            screen: screenFound,
          },
        });
      } catch (error) {
        console.error('SCREEN CONNECTION FAILED: ', error);
      }
    });
  }
}
