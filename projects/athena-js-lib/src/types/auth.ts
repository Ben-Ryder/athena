import {IUser} from "./user";

export interface LoginResponse {
  user: IUser,
  accessToken: string,
  refreshToken: string,
}

export interface RefreshResponse {
  accessToken: string,
  refreshToken: string,
}
