import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserProjectDto } from '../dto/user-project.dto';

@Controller('/v1/user')
// Este decorador nos permite hacer uso de los interceptors de NestJS.
// En esta caso estamos usando el decorador @Exclude en UserEntity para
// excluir el campo password en la respuestas devueltas al servidor
// Esta instruccion se puede colocar de forma general en todo el controller
// o especificamente en cada ruta donde se desee aplicar
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(body);
  }

  @Get()
  public async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserProjectDto) {
    return await this.userService.relationToProject(body);
  }

  @Get(':id')
  public async getOneUser(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  public async updateOneUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userService.updateById(id, body);
  }

  @Delete(':id')
  public async deleteOneUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.deleteById(id);
  }
}
