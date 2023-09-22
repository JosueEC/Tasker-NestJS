import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('v1/project')
@UseGuards(AuthGuard, RoleGuard, AccessLevelGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('CREATOR')
  @Post(':userId')
  public async createProject(
    @Body() body: CreateProjectDto,
    @Param('userId') userId: string,
  ) {
    return await this.projectService.create(body, userId);
  }

  @Get()
  public async findAllProjects() {
    return await this.projectService.findAll();
  }

  @Get(':projectId')
  public async findProjectById(@Param('projectId') id: string) {
    return await this.projectService.findOneById(id);
  }

  @AccessLevel(50)
  @Patch(':projectId')
  public async updateProjectById(
    @Param('projectId') id: string,
    @Body() body: UpdateProjectDto,
  ) {
    return await this.projectService.updateOneById(id, body);
  }

  @Delete(':projectId')
  public async deleteProjectById(@Param('projectId') id: string) {
    return await this.projectService.deleteOneById(id);
  }
}
