import {IsString, IsEmail, MinLength, IsOptional, ValidateIf, IsNotEmpty, MaxLength} from 'class-validator';

// todo: generate from CreateUserSchema as all fields are the same?
export class UpdateUserRequestSchema {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ValidateIf(o => 'username' in o)
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @ValidateIf(o => 'email' in o)
  @IsNotEmpty()
  email?: string;

  @IsString()
  @MinLength(8)
  @ValidateIf(o => 'password' in o)
  @IsNotEmpty()
  password?: string;

  @IsString()
  @ValidateIf(o => 'encryptionSecret' in o)
  @IsNotEmpty()
  encryptionSecret?: string;
}
