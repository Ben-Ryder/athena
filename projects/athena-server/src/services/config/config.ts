import * as dotenv from 'dotenv';
dotenv.config();

import {Injectable} from "@kangojs/core";


export interface ConfigInterface {
    node: {
        port: number,
        environment: string
    },
    database: {
        url: string
    },
    cache: {
      redisUrl: string
    },
    auth: {
        accessToken: {
            secret: string
        },
        refreshToken: {
            secret: string
        }
    }
}


@Injectable({
    identifier: "config-service",
    injectMode: "singleton"
})
export class ConfigService {
    readonly config: ConfigInterface = {
        node: {
            port: parseInt(process.env.NODE_PORT as string) || 3000,
            environment: process.env.NODE_ENV || 'production'
        },
        database: {
            url: process.env.DATABASE_URL as string
        },
        cache: {
            redisUrl: process.env.REDIS_URL as string
        },
        auth: {
            accessToken: {
                secret: process.env.ACCESS_TOKEN_SECRET as string
            },
            refreshToken: {
                secret: process.env.REFRESH_TOKEN_SECRET as string
            }
        }
    }
}
