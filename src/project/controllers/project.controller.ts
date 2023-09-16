import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto';

@Controller('v1/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  public async createProject(@Body() body: CreateProjectDto) {
    return await this.projectService.create(body);
  }

  @Get()
  public async findAllProjects() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  public async findProjectById(@Param('id') id: string) {
    return await this.projectService.findOneById(id);
  }

  @Patch(':id')
  public async updateProjectById(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ) {
    return await this.projectService.updateOneById(id, body);
  }

  @Delete(':id')
  public async deleteProjectById(@Param('id') id: string) {
    return await this.projectService.deleteOneById(id);
  }
}
