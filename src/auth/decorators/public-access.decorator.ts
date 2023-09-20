import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'src/constants';

// A traves de esta funcion es como podemos crear decoradores, los cuales
// reciben el contexto de la ruta
export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);
