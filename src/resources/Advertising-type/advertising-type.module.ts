import { Module } from '@nestjs/common';
import { AdvertisingTypeService } from './advertising-type.service';
import { AdvertisingTypeController } from './advertising-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisingType } from 'src/entities/advertising-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisingType])],
  controllers: [AdvertisingTypeController],
  providers: [AdvertisingTypeService],
})
export class AdvertisingTypeModule {}
