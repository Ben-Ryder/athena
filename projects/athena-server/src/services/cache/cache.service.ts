import Redis, {Redis as IRedis} from 'ioredis';
import { SystemError } from "@kangojs/core";
import {Injectable} from "@kangojs/core";

export interface CacheOptions {
    epochExpiry: number;
}


@Injectable()
export class CacheService {
    private redis: IRedis

    constructor() {
        this.redis = new Redis();
    }

    async addItem(key: string, value: any, options?: CacheOptions) {
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
}
