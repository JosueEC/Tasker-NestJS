import { ROLE } from 'src/constants';

declare namespace Express {
  interface Request {
    idUser: string;
    roleUser: ROLE;
  }
}
