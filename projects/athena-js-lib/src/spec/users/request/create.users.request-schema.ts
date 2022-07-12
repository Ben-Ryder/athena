import {IsString, IsEmail, MinLength, MaxLength} from 'class-validator';


export class CreateUserRequestSchema {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  encryptionSecret!: string;
}
