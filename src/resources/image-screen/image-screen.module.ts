import { Module } from '@nestjs/common';
import { ImageScreenService } from './image-screen.service';
import { ImageScreenController } from './image-screen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageScreen } from 'src/entities/image-screen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageScreen])],
  controllers: [ImageScreenController],
  providers: [ImageScreenService],
})
export class ImageScreenModule {}
