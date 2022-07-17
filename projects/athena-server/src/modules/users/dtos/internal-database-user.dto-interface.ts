import {UserDto} from "@ben-ryder/athena-js-lib";

export interface InternalDatabaseUserDto extends UserDto {
  id: string;
  username: string;
  email: string;
  encryption_secret: string;
  password_hash: string
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}