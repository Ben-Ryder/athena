import {IsOptional, IsString, MaxLength, MinLength} from 'class-validator';


export class CreateVaultRequestSchema {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description!: string;
}
