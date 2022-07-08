import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

// todo: generate from CreateUserSchema as all fields are the same?
export class UpdateUserRequestSchema {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  encryptionSecret?: string;
}
