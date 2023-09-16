import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectModule {}
