import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));

  app.enableCors(CORS);

  app.use(morgan('dev'));

  app.setGlobalPrefix('api');
  console.info(`Server listening on ${await app.getUrl()}`);
}
bootstrap();
