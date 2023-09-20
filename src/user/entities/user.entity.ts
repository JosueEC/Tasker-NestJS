import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../config/base.entity';
import { IUser } from '../interfaces/user.interface';
import { ROLE } from '../../constants/roles';
import { UsersProjectsEntity } from './usersProjects.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({
    name: 'firstName',
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    name: 'lastName',
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({
    name: 'age',
    type: 'smallint',
  })
  age: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  @Exclude()
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ROLE,
    default: ROLE.BASIC,
  })
  role: ROLE;

  @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.user)
  projectsIncludes: UsersProjectsEntity[];
}
