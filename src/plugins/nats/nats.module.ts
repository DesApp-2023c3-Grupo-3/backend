import { Global, Module } from '@nestjs/common';

import { NatsConnectionModule } from './natsConnection.module';
import { NatsService } from './nats.service';

@Global()
@Module({
  providers: [NatsService, NatsConnectionModule],
  exports: [NatsService],
})
export class NatsModule { }
