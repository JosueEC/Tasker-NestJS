import { ROLE } from 'src/constants/roles';

export interface PayloadToken {
  role: ROLE;
  sub: string;
}
