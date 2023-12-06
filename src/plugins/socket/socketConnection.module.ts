import { Inject, Module } from '@nestjs/common';
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
    this.initializeSectors();
    this.socketServer.on('connection', this.makeConnection.bind(this));
    console.info(`Socket server connected on port ${PORT}...`);
  }

  private async initializeSectors() {
    const sectorsFound = await this.sectorRepository.find();
    sectorsFound.map((sectorFound) => {
      const sectorSubject = new SectorSubject({
        data: sectorFound,
      });
      this.sectors.push(sectorSubject);
    });
  }

  private async makeConnection(ws: WebSocket) {
    ws.on('message', async (message) => {
      const data = JSON.parse(String(message));
      try {
        let screenFound = await this.getScreen(data.screenId);
        if (!screenFound) {
          screenFound = await this.createScreenWithDefaultConfig(data.screenId);
        }
        const sectorFound = await this.getSector(screenFound.sector.id);
        if (!sectorFound) {
          ws.send(
            JSON.stringify({
              id: -1,
              action: 'CONNECTION_ERROR',
              data: {
                message: 'Sector not found',
              },
            }),
          );
        } else {
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
        }
      } catch (error) {
        console.error('SCREEN CONNECTION FAILED: ', error);
      }
    });
  }

  private async createScreenWithDefaultConfig(subscription: string) {
    const newScreen = this.screenRepository.create({
      subscription,
      templeteId: '1',
      courseIntervalTime: 15,
      advertisingIntervalTime: 15,
      sector: await this.sectorRepository.findOne({ where: { id: 1 } }),
    });
    return this.screenRepository.save(newScreen);
  }

  private async getScreen(id: number) {
    return this.screenRepository.findOne({
      where: { id },
      relations: { sector: true },
    });
  }

  private async getSector(id: number) {
    return this.sectorRepository.findOne({
      where: { id },
    });
  }
}
