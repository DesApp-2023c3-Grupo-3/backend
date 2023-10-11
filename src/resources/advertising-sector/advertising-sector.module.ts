import { Module } from '@nestjs/common';
import { AdvertisingSectorService } from './advertising-sector.service';
import { AdvertisingSectorController } from './advertising-sector.controller';
import { AdvertisingSector } from 'src/entities/advertising-sector.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisingSector])],
  controllers: [AdvertisingSectorController],
  providers: [AdvertisingSectorService],
  exports: [AdvertisingSectorService],
})
export class AdvertisingSectorModule {}
