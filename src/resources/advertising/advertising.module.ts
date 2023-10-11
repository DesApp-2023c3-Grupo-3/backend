import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { SocketModule } from '../../plugins/socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { ScheduleModule } from '../schedule/schedule.module';
import { AdvertisingScheduleModule } from '../advertising-schedule/advertising-schedule.module';
import { AdvertisingSectorModule } from '../advertising-sector/advertising-sector.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Advertising]),
    SocketModule,
    ScheduleModule,
    AdvertisingScheduleModule,
    AdvertisingSectorModule,
  ],
  controllers: [AdvertisingController],
  providers: [AdvertisingService],
})
export class AdvertisingModule {}
