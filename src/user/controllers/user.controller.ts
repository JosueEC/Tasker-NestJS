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
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserProjectDto } from '../dto/user-project.dto';
import { PublicAccess } from 'src/auth/decorators/public-access.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('/v1/user')
// Este decorador nos permite hacer uso de los interceptors de NestJS.
// En esta caso estamos usando el decorador @Exclude en UserEntity para
// excluir el campo password en la respuestas devueltas al servidor
// Esta instruccion se puede colocar de forma general en todo el controller
// o especificamente en cada ruta donde se desee aplicar
@UseInterceptors(ClassSerializerInterceptor)
// Este decorador es el que nos permite usar los guards que hemos
// creado, en este caso es para el guard que da acceso a las rutas
// en base al token del usuario
// Nota: Loa guards se puden colocar a nivel global, de controlador y de
// ruta, dependiendo de donde querramos que sean usados
// NOTA 2: Al parecer los guards funcionan sin necesidad de exportarlos e
// importarlos en los modulos
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicAccess()
  @Post()
  public async createUser(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(body);
  }

  @Roles('ADMIN')
  @Get()
  public async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserProjectDto) {
    return await this.userService.relationToProject(body);
  }

  // Este es el decorador que creamos para establecer que esta ruta
  // sera de acceso publico, trabaja en conjunto con el decorador
  // @UseGuards que esta al principio de la clase
  @PublicAccess()
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
