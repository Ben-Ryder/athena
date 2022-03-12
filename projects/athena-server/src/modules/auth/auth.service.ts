import { AccessDeniedError } from '@kangojs/error-handler';

import { TokenService } from "../../services/token/token.service";
import { PasswordService } from "../../services/password/password.service";

import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dtos/users.dto";

export class AuthService {
    constructor(
        private usersService: UsersService = new UsersService(),
        private tokenService: TokenService = new TokenService()
    ) {}

    async login(username: string, password: string) {
       let user: UserDto;

       try {
           user = await this.usersService.getFullByUsername(username);
       }
       catch (e) {
           throw new AccessDeniedError({
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       const passwordValid = PasswordService.checkPassword(password, user.password);
       if (!passwordValid) {
         throw new AccessDeniedError({
           message: 'The supplied username & password combination is invalid.',
           applicationMessage: 'The supplied username & password combination is invalid.'
         });
       }

       return this.tokenService.createTokenPair(user.id);
    }

    async logout(refreshToken: string, accessToken?: string) {
        await this.tokenService.addTokenToBlacklist(refreshToken);

        if (accessToken) {
          await this.tokenService.addTokenToBlacklist(accessToken);
        }
    }

    async refresh(refreshToken: string) {
        const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

        if (!tokenPayload) {
          throw new AccessDeniedError({
            message: 'The supplied refresh token is invalid.',
            applicationMessage: 'The supplied refresh token is invalid.'
          });
        }

        await this.tokenService.addTokenToBlacklist(refreshToken);
        return this.tokenService.createTokenPair(tokenPayload.userId);
    }
}
