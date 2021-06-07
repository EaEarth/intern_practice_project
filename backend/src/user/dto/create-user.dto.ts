import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly mobile: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
