import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { SocketModule } from 'src/plugins/socket/socket.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService, SocketModule],
})
export class CourseModule { }
