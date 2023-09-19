import { Module, Global } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';

@Global()
// Este decorador nos permite dar acceso a un modulo de forma
// global, de esta forma no sera necesario declararlo en los
// demas modulos, ya que este podra ser accesible desde toda
// la aplicacion. Esto es util cuando hay alguna servicio que
// recurrentemente va a ser usado en otros modulos
@Module({
  // Para hacer uso de alguno de los scripts de otro modulo
  // debemos importar dicho modulo en el arreglo de imports
  // del modulo separado en el que deseamos usar los servicios
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
