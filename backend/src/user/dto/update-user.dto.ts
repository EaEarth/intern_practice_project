import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/role/role.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: String;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  readonly mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly role?: Role[];
}
