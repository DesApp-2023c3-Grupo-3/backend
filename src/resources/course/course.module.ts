import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from 'src/plugins/socket/socket.module';
import { Course } from 'src/entities/course.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), SocketModule, ImageModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
