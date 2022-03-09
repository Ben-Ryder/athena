import { decode, sign, verify } from 'jsonwebtoken';
import cron from "node-cron";

export interface TokenPayload {
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
    accessTokenBlacklist: string[] = [];
    accessTokenBlacklistCron: string;
    refreshTokenBlacklist: string[] = [];
    refreshTokenBlacklistCron: string;

    constructor() {
        this.accessTokenSecret = <string> process.env.ACCESS_TOKEN_SECRET;
        this.refreshTokenSecret = <string> process.env.REFRESH_TOKEN_SECRET;
        this.accessTokenBlacklistCron = <string> process.env.ACCESS_TOKEN_BLACKLIST_CRON;
        this.refreshTokenBlacklistCron = <string> process.env.REFRESH_TOKEN_BLACKLIST_CRON;

        // @todo: separate into separate cron service?
        cron.schedule(this.accessTokenBlacklistCron, this.pruneAccessTokenBlacklist)
        cron.schedule(this.refreshTokenBlacklistCron, this.pruneRefreshTokenBlacklist)
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

    private createAccessToken(userId: string) {
        return sign({id: userId, type: "accessToken"}, this.accessTokenSecret, {expiresIn: '1h'});
    }

    private createRefreshToken(userId: string) {
        return sign({id: userId, type: "refreshToken"}, this.refreshTokenSecret, {expiresIn: '7 days'});
    }

    isValidAccessToken(token: string) {
        try {
            // verify will throw an error if it fails
            verify(token, this.accessTokenSecret);

            if (!this.accessTokenBlacklist.includes(token)) {
                return true;
            }
        }
        catch (err) {}

        return false;
    }

    isValidRefreshToken(token: string) {
        try {
            // verify will throw an error if it fails
            verify(token, this.refreshTokenSecret);

            if (!this.refreshTokenBlacklist.includes(token)) {
                return true;
            }
        }
        catch (err) {}

        return false;
    }

    getAccessTokenPayload(token: string): AccessTokenPayload {
        return <AccessTokenPayload> decode(token);
    }

    getRefreshTokenPayload(token: string): RefreshTokenPayload {
        return <RefreshTokenPayload> decode(token);
    }

    blacklistAccessToken(token: string) {
        this.accessTokenBlacklist.push(token);
    }

    blacklistRefreshToken(token: string) {
        this.refreshTokenBlacklist.push(token);
    }

    pruneAccessTokenBlacklist() {
        this.accessTokenBlacklist = this.accessTokenBlacklist.filter(this.isValidAccessToken)
    }

    pruneRefreshTokenBlacklist() {
        this.refreshTokenBlacklist = this.refreshTokenBlacklist.filter(this.isValidRefreshToken)
    }
}
