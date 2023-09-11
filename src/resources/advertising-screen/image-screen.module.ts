import { Module } from '@nestjs/common';
import { AdvertisingScreenService } from './image-screen.service';
import { AdvertisingScreenController } from './image-screen.controller';

@Module({
  controllers: [AdvertisingScreenController],
  providers: [AdvertisingScreenService],
})
export class AdvertisingScreenModule {}
