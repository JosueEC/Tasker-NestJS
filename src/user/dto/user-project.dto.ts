import { ProjectEntity } from 'src/project/entities/project.entity';
import { UserEntity } from '../entities/user.entity';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class UserProjectDto {
  @IsNotEmpty()
  @IsUUID()
  user: UserEntity;

  @IsNotEmpty()
  @IsUUID()
  project: ProjectEntity;

  @IsNotEmpty()
  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;
}
