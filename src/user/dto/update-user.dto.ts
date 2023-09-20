import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ROLE } from 'src/constants/roles';
import { IUser } from '../interfaces/user.interface';

export class UpdateUserDto implements IUser {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(ROLE)
  role: ROLE;
}
