import { Global, Module } from '@nestjs/common';

import { SocketConnectionModule } from './socketConnection.module';
import { SocketService } from './socket.service';

@Global()
@Module({
  providers: [SocketService, SocketConnectionModule],
  exports: [SocketService],
})
export class SocketModule { }
