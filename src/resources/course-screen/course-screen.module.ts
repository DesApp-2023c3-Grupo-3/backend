import { Module } from '@nestjs/common';
import { CourseScreenService } from './course-screen.service';
import { CourseScreenController } from './course-screen.controller';

@Module({
  controllers: [CourseScreenController],
  providers: [CourseScreenService],
})
export class CourseScreenModule {}
