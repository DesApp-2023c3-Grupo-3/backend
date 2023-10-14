import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from 'src/plugins/socket/socket.module';
import { Course } from 'src/entities/course.entity';
import { ImageModule } from '../image/image.module';
import { SectorModule } from '../sector/sector.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { SubjectModule } from '../subject/subject.module';
import { ClassroomModule } from '../classroom/classroom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    SocketModule,
    ImageModule,
    ScheduleModule,
    ClassroomModule,
    SectorModule,
    SubjectModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
