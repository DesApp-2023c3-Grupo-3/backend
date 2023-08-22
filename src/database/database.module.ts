import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory(dbConfig: ConfigType<typeof databaseConfig>) {
        return {
          autoLoadEntities: true,
          ...dbConfig,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
