import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get()
  index(): Promise<UserDocument[]> {
    return this.service.index();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserDocument> {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.service.create(createUserDto);
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return await this.service.update(updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserDocument> {
    return await this.service.delete(id);
  }
}
