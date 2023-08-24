import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

import { NatsModule } from 'src/plugins/nats/nats.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService, NatsModule]
})
export class ImageModule { }
