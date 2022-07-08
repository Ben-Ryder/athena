import { IsString, IsEmail, MinLength } from 'class-validator';


export class CreateUserRequestSchema {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  encryptionSecret!: string;
}
