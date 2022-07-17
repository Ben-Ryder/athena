import {IsString, MinLength, IsOptional, ValidateIf, IsNotEmpty, MaxLength} from 'class-validator';

// todo: generate from CreateVaultRequestSchema as all fields are the same?
export class UpdateVaultRequestSchema {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @ValidateIf(o => 'name' in o)
  @IsNotEmpty()
  name?: string;

  @IsString()
  @MaxLength(255)
  @ValidateIf(o => 'description' in o)
  @IsNotEmpty()
  description?: string;
}

