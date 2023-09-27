import { Module } from '@nestjs/common';
import { AdvertisingScheduleService } from './advertising-schedule.service';
import { AdvertisingScheduleController } from './advertising-schedule.controller';
import { AdvertisingSchedule } from 'src/entities/advertising-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisingSchedule])],
  controllers: [AdvertisingScheduleController],
  providers: [AdvertisingScheduleService],
})
export class AdvertisingScheduleModule {}
