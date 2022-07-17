import {decode, JwtPayload, sign, verify} from 'jsonwebtoken';

import { ConfigService } from '../config/config';
import { CacheService } from "../cache/cache.service";
import { Injectable } from "@kangojs/core";
import {UserDto} from "@ben-ryder/athena-js-lib";

export interface TokenPayload extends JwtPayload {
    userId: string;
    userIsVerified: boolean
}

export interface AccessTokenPayload extends TokenPayload {
    type: 'accessToken'
}

export interface RefreshTokenPayload extends TokenPayload {
    type: 'refreshToken'
}

export interface TokenPair {
    accessToken: string,
    refreshToken: string
}

@Injectable()
export class TokenService {
    constructor(
      private configService: ConfigService,
      private cacheService: CacheService
    ) {}

    /**
     * Create an access and refresh token for the given user.
     * @param user
     */
    createTokenPair(user: UserDto): TokenPair {
        return {
            accessToken: this.createAccessToken(user),
            refreshToken: this.createRefreshToken(user)
        }
    }

    /**
     * Create an access token for the given user.
     * @param user
     */
    private createAccessToken(user: UserDto) {
        return sign(
          {type: "accessToken", userId: user.id, userIsVerified: user.isVerified},
          this.configService.config.auth.accessToken.secret,
          {expiresIn: this.configService.config.auth.accessToken.expiry}
        );
    }

    /**
     * Create a refresh token for the given user.
     * @param user
     */
    private createRefreshToken(user: UserDto) {
        return sign(
          {type: "refreshToken", userId: user.id, userIsVerified: user.isVerified},
          this.configService.config.auth.refreshToken.secret,
          {expiresIn: this.configService.config.auth.refreshToken.expiry}
        );
    }

    /**
     * Validate the given token. Return it's payload if valid or null if not.
     * @param token
     * @param secret
     */
    private async validateAndDecodeToken<PayloadType>(token: string, secret: string) {
        let payload: PayloadType|string;

        try {
            payload = <PayloadType | string>verify(token, secret);
        }
        catch (err) {
            // verify will throw an error if it fails
            return null;
        }

        const isBlacklisted = await this.cacheService.itemExists(token);
        if (!isBlacklisted && typeof payload !== 'string') {
            return payload;
        }

        return null;
    }

    /**
     * Validate the given access token. Return it's payload if valid or null if not.
     * @param token
     */
    async validateAndDecodeAccessToken(token: string) {
        return this.validateAndDecodeToken<AccessTokenPayload>(token, this.configService.config.auth.accessToken.secret);
    }

    /**
     * Validate the given refresh token. Return it's payload if valid or null if not.
     * @param token
     */
    async validateAndDecodeRefreshToken(token: string) {
        return this.validateAndDecodeToken<RefreshTokenPayload>(token, this.configService.config.auth.refreshToken.secret);
    }

    /**
     * Validate the supplied token.
     *
     * @param token
     * @param secret
     */
    private static async isValidToken(token: string, secret: string) {
        try {
            verify(token, secret);
        }
        catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Validate the supplied access token.
     *
     * @param token
     */
    async isValidAccessToken(token: string) {
        return TokenService.isValidToken(token, this.configService.config.auth.accessToken.secret);
    }

    /**
     * Validate if the given refresh token was signed by the token service at some point.
     *
     * @param token
     */
    async isValidRefreshToken(token: string) {
        return TokenService.isValidToken(token, this.configService.config.auth.refreshToken.secret);
    }

    async addTokenToBlacklist(token: string) {
        const payload = decode(token);

        if (typeof payload !== 'string' && payload?.exp) {
            await this.cacheService.addItem(token, true, {epochExpiry: payload.exp});
        }
        else {
            await this.cacheService.addItem(token, true);
        }
    }
}
