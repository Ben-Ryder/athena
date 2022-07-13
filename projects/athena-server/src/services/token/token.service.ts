import {decode, JwtPayload, sign, verify} from 'jsonwebtoken';

import { ConfigService } from '../config/config';
import { CacheService } from "../cache/cache.service";
import { Injectable } from "@kangojs/core";

export interface TokenPayload extends JwtPayload {
    userId: string
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
     * @param userId
     */
    createTokenPair(userId: string): TokenPair {
        return {
            accessToken: this.createAccessToken(userId),
            refreshToken: this.createRefreshToken(userId)
        }
    }

    /**
     * Create an access token for the given user.
     * @param userId
     */
    private createAccessToken(userId: string) {
        return sign(
          {userId, type: "accessToken"},
          this.configService.config.auth.accessToken.secret,
          {expiresIn: this.configService.config.auth.accessToken.expiry}
        );
    }

    /**
     * Create a refresh token for the given user.
     * @param userId
     */
    private createRefreshToken(userId: string) {
        return sign(
          {userId, type: "refreshToken"},
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
     * Validate if the given token was signed with the given secret, ignoring expiry details.
     *
     * @param token
     * @param secret
     */
    private static async isSignedToken(token: string, secret: string) {
        try {
            verify(token, secret, {ignoreExpiration: true});
        }
        catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Validate if the given access token was signed by the token service at some point.
     *
     * @param token
     */
    async isSignedAccessToken(token: string) {
        return TokenService.isSignedToken(token, this.configService.config.auth.accessToken.secret);
    }

    /**
     * Validate if the given refresh token was signed by the token service at some point.
     *
     * @param token
     */
    async isSignedRefreshToken(token: string) {
        return TokenService.isSignedToken(token, this.configService.config.auth.refreshToken.secret);
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
