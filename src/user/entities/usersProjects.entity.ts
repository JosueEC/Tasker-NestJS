import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../config/base.entity';
import { ACCESS_LEVEL } from '../../constants/roles';
import { UserEntity } from './user.entity';
import { ProjectEntity } from '../../project/entities/project.entity';

@Entity({ name: 'users_projects' })
export class UsersProjectsEntity extends BaseEntity {
  @Column({
    name: 'accesLevel',
    type: 'enum',
    enum: ACCESS_LEVEL,
    default: ACCESS_LEVEL.MANTEINER,
  })
  accesLevel: ACCESS_LEVEL;

  @ManyToOne(() => UserEntity, (user) => user.projectsIncludes)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.usersIncludes)
  project: ProjectEntity;
}
