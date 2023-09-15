import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/config/base.entity';
import { IProject } from 'src/interfaces/project.interface';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity implements IProject {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
  })
  description: string;
}
