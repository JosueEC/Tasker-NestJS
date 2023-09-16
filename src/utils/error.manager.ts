import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  // HttpStatus es un valor enum propio de nestjs.
  // A traves de la instruccion keyof typeof, lo que hacemos
  // es obtener toda la lista de claves del enum HttpStatus,
  // de esta forma es como tipamos el parametro type, el cual
  // podra recibir cualquier valor de esta lista de claves
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    // La clase de error, solo recibe un mensaje en la funcion super
    super(`${type} :: ${message}`);
  }

  public static createSignatureError(message: string) {
    // Aqui obtenemos el tipo del error que ha sido recibido, este viene
    // en el message y lo obtenemos a traves del .split en la posicion 0
    const name = message.split(' :: ')[0];

    if (name) {
      // Si es que el tipo existe, entonces lanzamos la excepcion usando la
      // clase HttpException, esta recibe el message y el tipo de exception
      // la cual la mandamos a traves del enum HttpStatus.
      //* NOTA: El value de los enums tambien puede ser accedido a traves de
      //* la bracket notation, por ende aqui devolvemos el tipo que ha sido
      //* obtenido del message que llego a la funcion
      throw new HttpException(message, HttpStatus[name]);
    } else {
      // En el caso en el que no existe el tipo, entonces lanzamos un error
      // interno del servidor, ya que no se ha identificado el tipo de error
      // lanzado
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
