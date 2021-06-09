import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/role/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  readonly mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role?: Role[];
}
