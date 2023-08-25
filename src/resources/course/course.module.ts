import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { NatsModule } from 'src/plugins/nats/nats.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService, NatsModule],
})
export class CourseModule { }
