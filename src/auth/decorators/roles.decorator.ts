import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/constants';
import { ROLES_KEY } from 'src/constants/key-decorators';

// El dato que llega por parametro a la funcion creadora del
// decorador, son parametros que pueden recibir los decoradores
// una vez que son utilizados, en este caso va a poder redibir
// BASIC o ADMIN que son tipos que obtenemos de la instruccion
// keyof typeof ROLE
// Recordemos que esta es la forma de obtener las claves de un
// enum para poder tipar algo en base a las claves del enum

// Estos datos son lo que mandamos en la metadata, junto con la key
// del decorador, que esta es para poder identificar que decorador
// se esta usando
export const Roles = (...roles: Array<keyof typeof ROLE>) =>
  SetMetadata(ROLES_KEY, roles);
