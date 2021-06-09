import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/role/roles.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Role } from '../role/role.enum';
import { Roles } from '../role/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({
    status: 200,
    description: 'Query all users',
    type: [User],
  })
  @Get()
  index(@Request() request): Promise<UserDocument[]> {
    return this.service.index();
  }

  @ApiOperation({ summary: 'Get an user according to the id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Get the user according to the id',
    type: User,
  })
  @Get(':id')
  findById(@Param('id') id: string): Promise<UserDocument> {
    return this.service.findById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created succesfully',
    type: User,
  })
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.service.create(createUserDto);
      const { password, ...info } = createUserDto;
      const userInfo = { ...info, ...{ id: user.id }, ...{ role: user.role } };
      return userInfo;
    } catch (err) {
      throw new InternalServerErrorException('Email already exist');
    }
  }

  @ApiOperation({ summary: 'Update an user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated succesfully',
    type: User,
  })
  @Roles(Role.Admin)
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return await this.service.update(updateUserDto);
  }

  @ApiOperation({ summary: 'Delete an user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted succesfully',
    type: User,
  })
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserDocument> {
    return await this.service.delete(id);
  }
}
