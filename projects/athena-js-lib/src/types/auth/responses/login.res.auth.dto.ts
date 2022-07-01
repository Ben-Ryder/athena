import { UserDto } from "../../users/dtos/user.dto";

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}
