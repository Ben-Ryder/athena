import {UserDto} from "../../users/dtos/user.dto-interface";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}