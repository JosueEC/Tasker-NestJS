import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IProject } from 'src/interfaces';

export class CreateProjectDto implements IProject {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description: string;
}
