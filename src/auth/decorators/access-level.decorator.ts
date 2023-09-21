import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL_KEY } from 'src/constants/key-decorators';

// Este es otro ejemplo en el cual la funcion creadora del decorador
// recibie parametros, en este caso solo recibe un dato number, el
// cual se pasa a la metadata
export const AccessLevel = (level: number) =>
  SetMetadata(ACCESS_LEVEL_KEY, level);
