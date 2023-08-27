import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

import { SocketModule } from 'src/plugins/socket/socket.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService, SocketModule]
})
export class ImageModule { }
