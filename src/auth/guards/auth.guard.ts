import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants';
import { UserService } from 'src/user/services/user.service';
import { ErrorManager } from 'src/utils/error.manager';
import { IUseToken } from '../interfaces';
import { useToken } from '../utils/use.token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    // Reflector nos permite leer atributos de los decoradores
    private readonly reflector: Reflector,
  ) {}

  // En esta funcion recibimos todo el contexto de la peticion
  // osea, recibimos la funcion de la ruta, los decoradores de
  // la ruta e incluso los datos de request, response y next de
  // la peticion
  async canActivate(context: ExecutionContext) {
    try {
      // A traves del servicio de reflector es como vamos a
      // poder leer los decoradores. Basicamente aqui estamos
      // preguntando si existe el decorador Public en el
      // contexto
      const isPublic = this.reflector.get<boolean>(
        // Este seria el nombre del decorador, osea su 'key'
        PUBLIC_KEY,
        // A traves del context, que como dijimos, recibe en si
        // el contexto de la peticion, obtenemos el handler/manejador
        context.getHandler(),
      );

      // Esa funcion nos devolvera un true en caso de que el decorador
      // Public si existe en la ruta y por ende devolvemos el true
      // indicando que deje continuar la peticion ya que la ruta esta
      // marcada como publica a traves del decorador Public
      if (isPublic) {
        return true;
      }

      // Caso contrario vamos a manejar el rol del usuario para dar
      // o denegar accesos a rutas
      // Nuevamente, haciendo uso del context y con su metodo switchToHttp
      // podemos acceder a los datos de la request, response y next.
      // Nota: El dato generico debe ser importado de la libreria que se
      // esta usando, en nuestro caso se esta exportando de 'express'
      const req = context.switchToHttp().getRequest<Request>();

      // Obtenemos el token desde el header de la request
      const token = req.headers['user_token'];

      // verificamos si el token no existe/ no viene o si viene como un
      // array, en ese caso lanzamos la excepcion de no autorizado
      if (!token || Array.isArray(token)) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid token',
        });
      }

      // caso contrario donde si existe el token/si viene, se lo
      // pasamos a nuestra funcion que decodea el token y verifica
      // su fecha de expiracion
      const manageToken: IUseToken | string = useToken(token);

      // Ya que el resultado de la funcion tiene que ser un objeto
      // verificamos que esto sea asi, en el caso de que devolvio
      // un string, significa que fallo algo y el try-catch devolvio
      // el string 'Token is invalid'
      if (typeof manageToken === 'string') {
        // Por ende lanzamos la excepcion para notificar la usuario
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: manageToken,
        });
      }

      // La siguiente validacion es para verificar la expiracion
      // del token, donde si es el caso de que ya expirto, nuevamente
      // lanzamos la excepcion para notificar al usuario
      if (manageToken.isExpired) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Token expired',
        });
      }

      // La ultima comprobacion es verificar que el usuario que envio
      // el token si existe, para eso usamos el userService y buscamos
      // la info del user
      const { sub } = manageToken;
      const user = await this.userService.findById(sub);

      // En el caso en el que no se encontro, significa que es un token
      // invalido, por lo que lanzamos la excepcion para notificar
      if (!user) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user',
        });
      }

      req.idUser = user.id;
      req.roleUser = user.role;

      // Caso contrario todas las validaciones fueron aprobadas, osea,
      // el token es valido, no esta expirado y el usuario existe
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
