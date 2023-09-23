import { Global, Module } from '@nestjs/common';

import { SocketConnectionModule } from './socketConnection.module';
import { SocketService } from './socket.service';
import { ScreenModule } from 'src/resources/screen/screen.module';
import { SectorModule } from 'src/resources/sector/sector.module';

@Module({
  providers: [SocketService, SocketConnectionModule],
  imports: [ScreenModule, SectorModule],
  exports: [SocketService],
})
export class SocketModule {}
