import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Image } from 'src/entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocketModule } from 'src/plugins/socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService, SocketModule]
})
export class ImageModule { }
