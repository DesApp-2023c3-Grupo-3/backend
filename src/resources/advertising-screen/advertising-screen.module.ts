import { Module } from '@nestjs/common';
import { AdvertisingScreenService } from './advertising-screen.service';
import { AdvertisingScreenController } from './advertising-screen.controller';

@Module({
  controllers: [AdvertisingScreenController],
  providers: [AdvertisingScreenService],
})
export class AdvertisingScreenModule {}
