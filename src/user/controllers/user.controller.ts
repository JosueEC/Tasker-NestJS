import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserProjectDto } from '../dto/user-project.dto';

@Controller('/v1/user')
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
