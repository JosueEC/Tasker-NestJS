import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersProjectsEntity } from './entities/usersProjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UsersProjectsEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  // Para que un modulo externo a otro pueda usar los servicios de este
  // modulo, debemos agregar el archivo al arrgelo de exports
})
export class UserModule {}
