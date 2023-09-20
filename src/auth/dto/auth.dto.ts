import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthBody } from '../interfaces/auth-body.interface';

export class AuthDto implements AuthBody {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  password: string;
}
