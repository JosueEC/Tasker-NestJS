import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  public async create(body: CreateProjectDto): Promise<ProjectEntity> {
    try {
      return await this.projectRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAll(): Promise<ProjectEntity[]> {
    try {
      return await this.projectRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findOneById(id: string): Promise<ProjectEntity> {
    try {
      // Aqui basicamente se realiza la misma consulta que en la
      // funcion de user.service, pero esta es de la otra punta
      // de la relacion, donde ahora devolvemos los proyectos
      // con los datos de la relacion con usuarios y la info
      // de estos usuarios
      const projectExists = await this.projectRepository
        .createQueryBuilder('project')
        .where({ id })
        .leftJoinAndSelect('project.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'user')
        .getOne();

      if (!projectExists) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found :(',
        });
      }

      return projectExists;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateOneById(
    id: string,
    body: UpdateProjectDto,
  ): Promise<UpdateResult> {
    try {
      const projectExists = await this.projectRepository.findOneBy({ id });

      if (!projectExists) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found :(',
        });
      }

      const response: UpdateResult = await this.projectRepository.update(
        id,
        body,
      );

      if (response.affected === 0) {
        throw new ErrorManager({
          type: 'NOT_MODIFIED',
          message: 'Something went wrong',
        });
      }

      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteOneById(id: string): Promise<DeleteResult> {
    try {
      const projectExists = await this.projectRepository.findOneBy({ id });

      if (!projectExists) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found :(',
        });
      }

      const response: DeleteResult = await this.projectRepository.delete(id);

      if (response.affected === 0) {
        throw new ErrorManager({
          type: 'NOT_MODIFIED',
          message: 'Something went wrong',
        });
      }

      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
