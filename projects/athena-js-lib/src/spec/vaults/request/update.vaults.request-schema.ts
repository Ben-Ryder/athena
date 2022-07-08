import {IsString, MinLength, IsOptional} from 'class-validator';

// todo: generate from CreateVaultRequestSchema as all fields are the same?
export class UpdateVaultRequestSchema {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

