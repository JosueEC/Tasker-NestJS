import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto, CreateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async create(body: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.userRepository.save(body);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  // El metodo createQueryBuilder nos permite crear queries
  // customizadas en base a las funciones que deseemos encadenar.
  // Este es mas recomendado usarlo cuando la consulta es compleja
  // e implica la devolucion de grandes cantidades de datos
  public async findById(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateById(
    id: string,
    body: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      const result: UpdateResult = await this.userRepository.update(id, body);
      if (result.affected === 0) {
        return undefined;
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteById(id: string): Promise<DeleteResult> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);
      if (result.affected === 0) {
        return undefined;
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
