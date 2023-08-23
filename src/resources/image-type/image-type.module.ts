import { Module } from '@nestjs/common';
import { ImageTypeService } from './image-type.service';
import { ImageTypeController } from './image-type.controller';

@Module({
  controllers: [ImageTypeController],
  providers: [ImageTypeService],
})
export class ImageTypeModule {}
