import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/config/base.entity';
import { IUser } from 'src/interfaces/user.interface';

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
  password: string;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 255,
  })
  role: string;
}
