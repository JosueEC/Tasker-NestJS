import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Esta parte es para que la aplicacion tenga conocimiento
    // y acceso de las variables de entorno
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    // Pasamos la configuracion de la DB creada en la constante
    // DataSourceConfig de la carpeta config
    TypeOrmModule.forRoot(DataSourceConfig),
    UserModule,
    ProjectModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
