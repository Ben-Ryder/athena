import { agent as _request } from "supertest";
import {KangoJS} from "@kangojs/core";
import {createServeSPAMiddleware} from "@kangojs/serve-spa";
import {ClassValidator} from "@kangojs/class-validation";

import {BaseController} from "../../src/modules/base/base.controller";
import {AuthController} from "../../src/modules/auth/auth.controller";
import {UsersController} from "../../src/modules/users/users.controller";
import {AuthValidator} from "../../src/modules/auth/auth.validator";
import {ConfigService, config, ConfigInterface} from "../../src/services/config/config";
import {DatabaseService} from "../../src/services/database/database.service";
import {testEnvironmentVars, testUsers} from "../test-data";
import {TokenPair, TokenService} from "../../src/services/token/token.service";


/**
 * An application wrapper which extends the default KangoJS application
 * and provides common testing functionality such as database setup/teardown and
 * bearer token generation.
 */
export class TestApplication extends KangoJS {
  /**
   * Reset the database to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.dependencyContainer.useDependency(DatabaseService);
    const sql = await databaseService.getSQL();

    // Because "on delete cascade" is present on all relationships
    // deleting users will automatically delete all content too.
    await sql`DELETE FROM users`;

    // Add Users
    for (const user of testUsers) {
      await sql`
        INSERT INTO users(id, username, email, password_hash, encryption_secret, is_verified, created_at, updated_at) 
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.encryptionSecret}, ${user.isVerified}, ${user.createdAt}, ${user.updatedAt})
       `;
    }
  }

  /**
   *
   * @param userId
   */
  async getRequestTokens(userId: string): Promise<TokenPair> {
    const tokenService = this.dependencyContainer.useDependency(TokenService);
    return tokenService.createTokenPair(userId);
  }
}

class TestConfigService extends ConfigService {
  config: ConfigInterface = {
    ...config,
    auth: {
      accessToken: {
        secret: testEnvironmentVars.ACCESS_TOKEN_SECRET,
        expiry: testEnvironmentVars.ACCESS_TOKEN_EXPIRY
      },
      refreshToken: {
        secret: testEnvironmentVars.REFRESH_TOKEN_SECRET,
        expiry: testEnvironmentVars.REFRESH_TOKEN_EXPIRY
      }
    },
    database: {
      url: process.env.TESTING_DATABASE_URL as string
    },
    cache: {
      redisUrl: process.env.TESTING_REDIS_URL as string
    },
  }
}

export const getTestApplication = async function() {
  const serveSpaMiddleware = createServeSPAMiddleware({
    folderPath: "../../dashboard/build"
  });

  const testApplication = new TestApplication({
    dependencyOverrides: [
      {
        original: ConfigService,
        override: TestConfigService
      }
    ],
    controllers: [
      BaseController,
      AuthController,
      UsersController
    ],
    middleware: [
      serveSpaMiddleware
    ],
    authValidator: AuthValidator,
    bodyValidator: ClassValidator,
    queryValidator: ClassValidator,
    paramsValidator: ClassValidator
  });
  const testExpressApp = testApplication.getApp();

  return {
    testApplication,
    testClient: _request(testExpressApp)
  };
};
