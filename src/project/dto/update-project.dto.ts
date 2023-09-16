import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IProject } from 'src/interfaces';

export class UpdateProjectDto implements IProject {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description: string;
}
