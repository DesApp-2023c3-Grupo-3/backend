import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import serverConfig from './config/server.config';
import { DatabaseModule } from './database/database.module';
import { SocketModule } from './plugins/socket/socket.module';
import { UserModule } from './resources/user/user.module';
import { AdvertisingModule } from './resources/advertising/advertising.module';
import { CourseModule } from './resources/course/course.module';
import { SubjectModule } from './resources/subject/subject.module';
import { CourseScreenModule } from './resources/course-screen/course-screen.module';
import { SectorModule } from './resources/sector/sector.module';
import { ScreenModule } from './resources/screen/screen.module';
import { AdvertisingTypeModule } from './resources/Advertising-type/advertising-type.module';
import { AdvertisingScreenModule } from './resources/advertising-screen/advertising-screen.module';
import { ClassroomModule } from './resources/classroom/classroom.module';
import { RoleModule } from './resources/role/role.module';
import { ImageModule } from './resources/image/image.module';
import { AuthModule } from './resources/auth/auth.module';
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from './common/middlewares/keycloak.module';
import { KeycloakConfigService } from './common/middlewares/keycloak-config.service';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig, databaseConfig],
      isGlobal: true,
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    DatabaseModule,
    SocketModule,
    AuthModule,
    UserModule,
    AdvertisingModule,
    CourseModule,
    SubjectModule,
    CourseScreenModule,
    SectorModule,
    ScreenModule,
    AdvertisingTypeModule,
    AdvertisingScreenModule,
    ClassroomModule,
    RoleModule,
    ImageModule,
    // ScheduleModule,
    // AdvertisingScheduleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
