import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import serverConfig from '../config/server.config';

import { LoggingMiddleware } from './middlewares/logging-middleware';
import { AuthGuard } from '@nestjs/passport';

@Module({
  imports: [ConfigModule.forFeature(serverConfig)],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
