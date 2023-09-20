import { TokenDecoded, IUseToken } from '../interfaces';
import * as jwt from 'jsonwebtoken';

// Este metodo lo que hara es devolver informacion del usuario en
// base al token que llega en la peticion, de esta forma se podra
// usar para dar o no autorizaciones
export const useToken = (token: string): IUseToken | string => {
  try {
    // Primero usamos el metodo decode de JWT para obtener la
    // informacion que viene hasheada en el token, es lo mismo
    // que se puede hacer en la pagina oficial de JWT

    // El 'as TokenDecoded' es porque la funcion devuelve un string
    // o un jwt.JwtPayload, pero este no contiene la informacion
    // que necesitamos, por ende con esta instruccion tipamos el
    // resultado del metodo usando nuestra interface TokenDecode, la
    // cual si nos permite el autocompletado con la informacion que
    // necesitamos
    const decode = jwt.decode(token) as TokenDecoded;

    // En esta parte vamos a verificar si el token no ha expirado
    // Primero obtenemos la fecha actual
    const currenteDate = new Date();
    // Y la fecha de expiracion del token, la cual viene el resultado
    // del .decode del token recibido
    const expiresDate = new Date(decode.exp);

    // Devolvemos la informacion decodeada del token
    return {
      sub: decode.sub,
      role: decode.role,
      // Pero el dato 'isExpired' sera un valor calculado, el cual
      // devolvera true si el token no ha expirado y false si este
      // ya expiro
      // La razon de colocar el '/1000' es porque el metodo new Date
      // agregar digitos extra a la fecha, por ende con esta division
      // eliminamos esos digitos extra
      isExpired: +expiresDate <= +currenteDate / 1000,
    };
  } catch (error) {
    return 'Token is invalid';
  }
};
