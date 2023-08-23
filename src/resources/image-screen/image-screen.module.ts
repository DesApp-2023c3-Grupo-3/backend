import { Module } from '@nestjs/common';
import { ImageScreenService } from './image-screen.service';
import { ImageScreenController } from './image-screen.controller';

@Module({
  controllers: [ImageScreenController],
  providers: [ImageScreenService],
})
export class ImageScreenModule {}
