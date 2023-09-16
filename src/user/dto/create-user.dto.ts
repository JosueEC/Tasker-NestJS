import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ROLE } from 'src/constants/roles';
import { IUser } from 'src/interfaces/user.interface';

// Hacemos implementacion de la interface IUser para mantener la coherencia
// entre los DTO's y la entidad
export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsNumber()
  lastName: string;
  age: number;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
