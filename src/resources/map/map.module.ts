import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { ImageModule } from '../image/image.module';
import { Map } from 'src/entities/map.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Map]), ImageModule],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
