import {decode, JwtPayload, sign, verify} from 'jsonwebtoken';

import { config } from '../../config';
import { CacheService } from "../cache/cache.service";

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

export class TokenService {
    accessTokenSecret: string;
    refreshTokenSecret: string;

    constructor(
        private cacheService: CacheService = new CacheService()
    ) {
        this.accessTokenSecret = config.auth.accessToken.secret;
        this.refreshTokenSecret = config.auth.refreshToken.secret;
    }

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
        return sign({userId, type: "accessToken"}, this.accessTokenSecret, {expiresIn: '1h'});
    }

    /**
     * Create a refresh token for the given user.
     * @param userId
     */
    private createRefreshToken(userId: string) {
        return sign({userId, type: "refreshToken"}, this.refreshTokenSecret, {expiresIn: '7 days'});
    }

    /**
     * Validate the given token. Return it's payload if valid or null if not.
     * @param token
     * @param secret
     */
    private async validateAndDecodeToken<PayloadType>(token: string, secret: string) {
        try {
            // verify will throw an error if it fails
            const payload = <PayloadType|string> verify(token, this.accessTokenSecret);

            const isBlacklisted = await this.cacheService.itemExists(token);
            if (!isBlacklisted && typeof payload !== 'string') {
                return payload;
            }
        }
        catch (err) {}

        return null;
    }

    /**
     * Validate the given access token. Return it's payload if valid or null if not.
     * @param token
     */
    async validateAndDecodeAccessToken(token: string) {
        return this.validateAndDecodeToken<AccessTokenPayload>(token, this.accessTokenSecret);
    }

    /**
     * Validate the given refresh token. Return it's payload if valid or null if not.
     * @param token
     */
    async validateAndDecodeRefreshToken(token: string) {
        return this.validateAndDecodeToken<RefreshTokenPayload>(token, this.refreshTokenSecret);
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
        return TokenService.isSignedToken(token, this.accessTokenSecret);
    }

    /**
     * Validate if the given refresh token was signed by the token service at some point.
     *
     * @param token
     */
    async isSignedRefreshToken(token: string) {
        return TokenService.isSignedToken(token, this.refreshTokenSecret);
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
