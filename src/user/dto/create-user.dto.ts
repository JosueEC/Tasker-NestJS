import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ROLE } from 'src/constants/roles';
import { IUser } from '../interfaces/user.interface';

// Hacemos implementacion de la interface IUser para mantener la coherencia
// entre los DTO's y la entidad
export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
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
