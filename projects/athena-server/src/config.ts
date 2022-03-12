import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
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

export const config: Config = {
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
