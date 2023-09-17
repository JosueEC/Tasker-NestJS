import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, CreateUserDto } from '../dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import { UserProjectDto } from '../dto/user-project.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
  ) {}

  public async create(body: CreateUserDto): Promise<UserEntity> {
    try {
      const userExists = await this.userRepository.findOneBy({
        email: body.email,
      });

      if (userExists) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: `The email ${userExists.email} already exists`,
        });
      }

      body.password = await bcrypt.hash(body.password, +process.env.HASH_SALT);

      return await this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAll(): Promise<UserEntity[]> {
    try {
      const response: UserEntity[] = await this.userRepository.find();

      // Un posible manejo de error, es cuando no encontramos ningun resultado
      // a alguna peticion
      if (response.length === 0) {
        // Si es el caso, lanzamos una nueva instancia de nuestra clase
        // ErrorManager, la cual recibe el type y el message
        //* NOTA: Dado que agregamos tipado al type, podemos acceder a la lista
        //* de excepciones presionando 'ctrl + space'
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Users not found',
        });
      }

      return response;
    } catch (error) {
      // Esta instancia es capturada en la sentencia catch, y aqui es donde
      // invocamos al metodo createSignatureError, el cual es el que lanza
      // la exception como respuesta al cliente.
      // La instancia de la clase en si solo pasa el message al constructor
      // de la clase Error, de la cual estamos heredando en el ErrorManager
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // El metodo createQueryBuilder nos permite crear queries
  // customizadas en base a las funciones que deseemos encadenar.
  // Este es mas recomendado usarlo cuando la consulta es compleja
  // e implica la devolucion de grandes cantidades de datos
  public async findById(id: string): Promise<UserEntity> {
    try {
      const response: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        // Esta instruccion recibe la columna que tiene la relacion
        // y que objeto se desea de esa columna. Basicamente, esta
        // condicion agrega a la consulta los proyectos con los que
        // esta relacionado el user.
        // NOTA: esto solo devolvera la info de la tabla intermedia
        .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
        // Con esta segunda instruccion conectamos con la segunda tabla
        // de forma que en la misma consulta devolvemos tambien la
        // informacion del proyecto relacionado
        .leftJoinAndSelect('projectsIncludes.project', 'project')
        .getOne();

      if (!response) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User not found :(',
        });
      }

      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateById(
    id: string,
    body: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      const result: UpdateResult = await this.userRepository.update(id, body);
      if (result.affected === 0) {
        throw new ErrorManager({
          type: 'NOT_MODIFIED',
          message: 'Something went wrong!',
        });
      }

      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteById(id: string): Promise<DeleteResult> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorManager({
          type: 'NOT_MODIFIED',
          message: 'Something went wrong!',
        });
      }

      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async relationToProject(
    body: UserProjectDto,
  ): Promise<UsersProjectsEntity> {
    try {
      return await this.userProjectRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
