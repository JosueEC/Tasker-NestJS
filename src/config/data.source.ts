import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
// Esta es una estrategia de nombrado de las columnas en la BD
// por ejemplo: si tenemos la columna createdAt definida en nuestra
// entidad, esta se guardara como create_at en la base de datos, ya
// que esta es la nomenclatura de la snake strategy
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// El ConfigModule de Nest nos permite trabajar con variables
// de entorno ya que usa dotenv por debajo, se le debe pasar ale
// nombre del archivo de donde va a leer las variables, en este
// caso se pasa como una plantilla literal para que podamos
// movernos entre las variables de desarrollo y de produccion
ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

// La instancia de un objeto ConfigService nos permite acceder a
// estas variables desde la configuracion y no desde al archivo
// de esta forma, si cambia el archivo, esto solo se modificara
// en el ConfigModule
const configService = new ConfigService();

// El objeto de tipo DataSourceOptions es toda la configuracion
// del modulo para la base de datos
export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDS = new DataSource(DataSourceConfig);
