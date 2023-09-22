import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { UsersProjectsEntity } from 'src/user/entities/usersProjects.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, UsersProjectsEntity]),
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectModule {}
