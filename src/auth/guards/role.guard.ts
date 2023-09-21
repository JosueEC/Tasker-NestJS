import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PUBLIC_KEY, ROLE } from 'src/constants';
import { ADMIN_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      // NOTA: El .get<> del reflector nos permite tipar la
      // respuesta devuelta por el metodo
      // Nuevamente verificamos si existe el decorador Public
      // el contexto de la ruta
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      // Si es asi, entonces dejamos pasar la peticion al siguiente
      // guard, pipe, controller, ... retornando true
      if (isPublic) {
        return true;
      }

      // Caso contrario, verificamos si existe el decorador admin
      const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

      // Haciendo uso de la misma logica de la funcion anterior, es
      // como podemos buscar la existencia del decorador Roles
      const roles = this.reflector.get<Array<keyof typeof ROLE>>(
        ROLES_KEY,
        context.getHandler(),
      );

      // Para este guard requerimos acceder a la informacion de la request
      // esto lo logramos a traves de esta funcion
      const req = context.switchToHttp().getRequest<Request>();

      // Recuerda que en el guard AuthGuard inyectamos las propiedades de
      // idUser y userRole, esto fue porque en este guard son necesarias
      // En este caso obtenemos el role del usuario para controlar a que
      // rutas tiene acceso y a cuales no en base al mismo
      const { roleUser } = req;

      if (roles === undefined) {
        // Primero verificamos si si se encontro el decorador @Roles en la
        // ruta, en caso de que no...
        if (!admin) {
          // Verificamos entonces si existe el decorador @Admin en la ruta
          // igualmente en caso de que ambos no existen, significa que por
          // default se deja pasara al usuario asumiendo que su rol es BASIC
          // esto es para no tener que crear el decorador @BASIC y estarlo
          // colocando en todas las rutas, de esta forma se deja por default
          return true;
        } else if (admin && roleUser === admin) {
          // Caso contrario entonces si se encontro el decorador @Admin, ahora
          // verificamos que el rol del usuario sea tambien ADMIN, para asi
          // dejarlo pasar retornando el true
          return true;
        } else {
          // Y en el caso final, si se encontro el decorador @Admin pero el
          // rol del usuario no es ADMIN, por lo que se lanza la excepcion y
          // notificamos al usuario
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'You do not have permissions for this operations',
          });
        }
      }

      // El flujo anterior de comprobacioes fue para identificar si se
      // encontro el decorador @Admin en lugar del decorador @Roles, lo
      // siguiente es ahora para el decorador @Roles

      // Primero verificamos si el rol del usuario que viene en la request
      // es de alguno de los tipos que se reciben como parametro en el
      // decorador @Roles, esto lo logramos a traves de la funcion .some
      // la cual devuelve un booleano si la condicion estableceida se
      // cumple con al menos uno de los elementos
      const isAuth = roles.some((role) => role === roleUser);

      // En el caso donde no coincida ningun rol, entonces lanzamos la
      // exepcion para notificar al usuario
      if (!isAuth) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'You do not have permissions for this operation :/',
        });
      }

      // Caso contrario, donde si conicido el rol con alguno de los
      // roles reibidos en el decorador, entonces retornamos true
      // para dejar pasar la peticion al siguiente guard | pipe | controller | ...
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
