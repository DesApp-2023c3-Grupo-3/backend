import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverConfig from './config/server.config';
import { EntityNotFoundExceptionFilter } from './common/filters/entity-not-found.filter';

function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Cartelera')
    .setDescription('Una API para el manejo de carteleras de la UNAHUR')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function setUpExceptionFilters(app: INestApplication) {
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  initializeSwagger(app);
  setUpExceptionFilters(app);

  const config = app.get(serverConfig.KEY);
  await app.listen(config.port);

  new Logger('Main').log(`🚀 Aplicación ejecutándose en ${await app.getUrl()}`);
}

bootstrap();
