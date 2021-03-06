import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../role/roles.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Role } from '../role/role.enum';
import { Roles } from '../role/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({
    status: 200,
    description: 'Query all users',
    type: [User],
  })
  @Get()
  index(): Promise<User[]> {
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
    description:
      'Get the user according to the id or null if user does not exist',
    type: User || null,
  })
  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
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
      this.logger.error({ message: err.message });
      if (err.message.startsWith('E11000 duplicate key'))
        throw new InternalServerErrorException('Email already exist');
      else throw new InternalServerErrorException(err);
    }
  }

  @ApiOperation({ summary: 'Update an user' })
  @ApiResponse({
    status: 200,
    description:
      'The user has been updated succesfully or user does not exist if null',
    type: User || null,
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
    description:
      'The user has been deleted succesfully or user does not exist if null',
    type: User || null,
  })
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserDocument> {
    return await this.service.delete(id);
  }

  //------------------------------------ GCloud database--------------------------//

  @Roles(Role.Admin)
  @Post('/cloud')
  async createOnCloud(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.service.creatOnCloud(createUserDto);
      const { password, ...info } = createUserDto;
      const userInfo = { ...info, ...{ id: user.id }, ...{ role: user.role } };
      return userInfo;
    } catch (err) {
      console.log(err);
      this.logger.error({ message: err.message });
      if (err.message.startsWith('E11000 duplicate key'))
        throw new InternalServerErrorException('Email already exist');
      else throw new InternalServerErrorException(err);
    }
  }

  @Get('cloud')
  indexOnCloud() {
    return this.service.indexOnCloud();
  }

  @Roles(Role.Admin)
  @Delete('cloud/:email')
  async deleteOnCloud(@Param('email') email: string) {
    return await this.service.deleteOnCloud(email);
  }

  @Get('/cloud/email/:email')
  findByEmailOnCloud(@Param('email') email: string): Promise<User> {
    return this.service.findByEmailOnCloud(email);
  }
}
