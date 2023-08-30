import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import serverConfig from '../config/server.config';

import { LoggingMiddleware } from './middlewares/logging-middleware';

@Module({
  imports: [ConfigModule.forFeature(serverConfig)],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
