import {IsOptional, IsString, MinLength} from 'class-validator';


export class CreateVaultRequestSchema {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;
}
