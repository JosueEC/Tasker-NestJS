import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Esta funcion es la que inicializa toda la aplicacion
  const app = await NestFactory.create(AppModule);

  // Esta es para que podamos usar los class-validators en
  // nuestros DTO's y las validaciones sean ejecutadas
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Aqui obtenemos los datos de las variables de entorno que
  // estan en el ConfigService, de esta forma obtenemos el
  // puerto desde el archivo .env
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));

  // Aqui pasamoas la configuracion de CORS, la mayoria de estas
  // configuraciones estan en la carpeta config
  app.enableCors(CORS);

  // Hacemos uso del middleware morgan en modo desarrollador, esto
  // solo para trackera las peticiones que llegan al servidor
  app.use(morgan('dev'));

  // Una buena practica es establecer la palabra 'api' como sufijo
  // global de todos los endpoints del servidor
  app.setGlobalPrefix('api');

  // Por ultimo, notificamos que el servicio se esta ejecutando
  // y en que url/puerto esta a la escucha de peticiones
  console.info(`Server listening on ${await app.getUrl()}`);
}
bootstrap();
