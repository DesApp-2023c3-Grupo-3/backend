import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { SocketModule } from '../../plugins/socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Advertising])],
  controllers: [AdvertisingController],
  providers: [AdvertisingService, SocketModule],
})
export class AdvertisingModule {}
