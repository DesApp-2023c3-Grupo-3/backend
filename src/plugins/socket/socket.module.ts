import { Module } from '@nestjs/common';

import { SocketConnectionModule } from './socketConnection.module';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketService],
  imports: [SocketConnectionModule],
  exports: [SocketService],
})
export class SocketModule {}
