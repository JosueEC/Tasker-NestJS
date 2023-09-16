import { ROLE } from 'src/constants/roles';

// La interface nos va a permitir mantener una coherencia entre
// los DTO's y la entidad, ademas de poder desarrollar mas rapido
// gracias al autocompletado
export interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  username: string;
  password: string;
  role: ROLE;
}
