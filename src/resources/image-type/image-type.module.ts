import { Module } from '@nestjs/common';
import { ImageTypeService } from './image-type.service';
import { ImageTypeController } from './image-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageType } from 'src/entities/image-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageType])],
  controllers: [ImageTypeController],
  providers: [ImageTypeService],
})
export class ImageTypeModule {}
