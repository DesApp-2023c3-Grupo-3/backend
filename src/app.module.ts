import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import serverConfig from './config/server.config';

import { ContactosModule } from './resources/contactos/contactos.module';
import { UserModule } from './resources/user/user.module';
import { ImageModule } from './resources/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig, databaseConfig],
      isGlobal: true,
    }),
    DatabaseModule,

    ContactosModule,
    UserModule,
    ImageModule,
  ],
})
export class AppModule { }
