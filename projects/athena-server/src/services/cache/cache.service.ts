import Redis, {Redis as IRedis} from 'ioredis';
import { SystemError } from "@kangojs/core";
import {Injectable} from "@kangojs/core";
import {ConfigService} from "../config/config";

export interface CacheOptions {
    epochExpiry: number;
}


@Injectable()
export class CacheService {
    private redis: IRedis

    constructor(
      private configService: ConfigService
    ) {
        this.redis = new Redis(configService.config.cache.redisUrl);
    }

    checkStatus() {
        if (this.redis.status !== "ready") {
            throw new SystemError({
                message: "Redis connection has not been established."
            })
        }
    }

    async addItem(key: string, value: any, options?: CacheOptions) {
        this.checkStatus();

        try {
            if (options?.epochExpiry) {
                await this.redis.set(key, value, 'EXAT', options.epochExpiry);
            }
            else {
                await this.redis.set(key, value);
            }
        }
        catch (e) {
            throw new SystemError({
                message: "Error adding item to cache",
                originalError: e
            })
        }
    }

    async itemExists(key: string): Promise<boolean> {
        this.checkStatus();

        try {
            // Using !! to convert 0/1 to false/true
            return !!await this.redis.exists(key)
        }
        catch (e) {
            throw new SystemError({
                message: "Error adding item to cache",
                originalError: e
            })
        }
    }

    // todo: add @OnKill() decorator or similar to kangojs so services can handle cleanup
    async onKill() {
        this.redis.disconnect();
    }
}
