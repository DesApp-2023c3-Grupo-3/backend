import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import serverConfig from './config/server.config';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { SocketModule } from './plugins/socket/socket.module';

import { UserModule } from './resources/user/user.module';
import { ImageModule } from './resources/image/image.module';
import { CourseModule } from './resources/course/course.module';
import { ScheduleModule } from './resources/schedule/schedule.module';
import { SubjectModule } from './resources/subject/subject.module';
import { CourseScreenModule } from './resources/course-screen/course-screen.module';
import { SectorModule } from './resources/sector/sector.module';
import { ScreenModule } from './resources/screen/screen.module';
import { ImageTypeModule } from './resources/image-type/image-type.module';
import { ImageScreenModule } from './resources/image-screen/image-screen.module';
import { ClassroomModule } from './resources/classroom/classroom.module';
import { RoleModule } from './resources/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig, databaseConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    CommonModule,
    SocketModule,

    UserModule,
    ImageModule,
    CourseModule,
    ScheduleModule,
    SubjectModule,
    CourseScreenModule,
    SectorModule,
    ScreenModule,
    ImageTypeModule,
    ImageScreenModule,
    ClassroomModule,
    RoleModule,
  ],
})
export class AppModule {}
