import {UserDto} from "@ben-ryder/athena-js-lib";

export interface DatabaseUserDto extends UserDto {
  passwordHash: string;
}