import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY, ROLE } from 'src/constants';
import {
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  ROLES_KEY,
} from 'src/constants/key-decorators';
import { ErrorManager } from 'src/utils/error.manager';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
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

      const accesLevel = this.reflector.get<number>(
        ACCESS_LEVEL_KEY,
        context.getHandler(),
      );

      // Para este guard requerimos acceder a la informacion de la request
      // esto lo logramos a traves de esta funcion
      const req = context.switchToHttp().getRequest<Request>();

      // Recuerda que en el guard AuthGuard inyectamos las propiedades de
      // idUser y userRole, esto fue porque en este guard son necesarias
      // En este caso obtenemos el role del usuario para controlar a que
      // rutas tiene acceso y a cuales no en base al mismo
      const { roleUser, idUser } = req;

      // TODO: Hacer un refactor de estos guards para quitar los if's
      if (accesLevel === undefined) {
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
      }

      // Esta instruccion se encarga de que, si el rol enviado es el
      // de ADMIN, que directamente lo deje pasar. Esto es necesario
      // debido a que si usamos el decorador @Roles('BASIC') aunque
      // la peticion venga de un ADMIN este no lo deja pasar, con esta
      // condicion arreglamos eso
      if (roleUser === ROLE.ADMIN) {
        return true;
      }

      // En esta parte vamos a verificar el nivel de acceso del
      // usuario a los proyectos que tieneasignados

      // Primero obtenemos la info del usuario con el id que inyectamos
      // en la request
      const user = await this.userService.findById(idUser);

      // Una vez que tenemos su informacion, vamos a verificar si
      // este usuario esta asignado al proyecto al que intenta acceder

      // Para esto accedemos a la propiedad projectsIncludes, la cual es
      // un arreglo que da acceso a los registros de la tabla intermedia
      // gracias a la relacion ManyToMany
      // Vamos a recorrer estos registros accediendo a la propiedad project
      // NOTA: Esta propiedad asi como la de user, no es visible en la
      // tabla de BD, sin embargo estas se agregan por defecto al haber
      // establecido la relacion ManyToMany

      // Entonces, accedemos al projecto de la tabla intermedia y obtenemos
      // su ID, y verificamos que coincida con el que se esta enviando por
      // params en la request
      const userExistInProject = user.projectsIncludes.find(
        (userProjectItem) =>
          userProjectItem.project.id === req.params.projectId,
      );

      // si es asi, entonces significa que el user si tiene acceso
      // al project, de lo contrario lanzamos la excepcion
      // para notificar al cliente
      if (userExistInProject === undefined) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'You do not have access to this project :|',
        });
      }

      if (accesLevel !== userExistInProject.accessLevel) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'You do not have the level access needed :|',
        });
      }

      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
