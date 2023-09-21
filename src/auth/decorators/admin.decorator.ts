import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/constants';
import { ADMIN_KEY } from 'src/constants/key-decorators';

// En el envio de informacion por la metadata podemos pasar valores
// directamente, como en este caso, donde este decorador sera para
// dar acceso a usuarios con el rol admin, por lo que pasamaos el
// enum admin directamente a la metadata
export const AdminAccess = () => SetMetadata(ADMIN_KEY, ROLE.ADMIN);
