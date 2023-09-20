import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Body,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ErrorManager } from 'src/utils/error.manager';
import { AuthDto } from '../dto/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // El metodo login es el que va a validar las credenciales del
  // usuario y devolver la informacion del mismo junto con su token
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(@Body() { username, password }: AuthDto) {
    // A traves de la funcion validateUser enviamos las credenciales
    // la funcion busca y valida las credenciales y devuelve la
    // info del usuario una vez que ha sido validado
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );

    // Esto lo comprobamos aqui, donde en un caso en el que la
    // validacion no fue correcto lanzamos el error para notificar
    // al cliente
    if (!userValidate) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Invalid credentials',
      });
    }

    // Caso contrario, llamamos a la funcion generateJWT, la cual
    // busca nuevamente la informacion del usuario y la devuelve
    // en conjunto con su jsonwebtoken
    const jwt = await this.authService.generateJWT(userValidate);

    // Finalmente, si todo salio bien, devolvemos la informacion del
    // usurario junto con su token
    return jwt;
  }
}
