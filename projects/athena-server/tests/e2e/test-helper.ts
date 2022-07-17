import {TokenPair, TokenService} from "../../src/services/token/token.service";
import {DatabaseService} from "../../src/services/database/database.service";
import {testData, testUsers} from "../test-data";
import {createServeSPAMiddleware} from "@kangojs/serve-spa";
import {ConfigService} from "../../src/services/config/config";
import {BaseController} from "../../src/modules/base/base.controller";
import {AuthController} from "../../src/modules/auth/auth.controller";
import {UsersController} from "../../src/modules/users/users.controller";
import {AuthValidator} from "../../src/modules/auth/auth.validator";
import {ClassValidator} from "@kangojs/class-validation";
import {TestConfigService} from "./test-config-service";
import {KangoJS} from "@kangojs/core";
import {SuperAgentTest, agent} from "supertest";
import {CacheService} from "../../src/services/cache/cache.service";
import {UserDto} from "@ben-ryder/athena-js-lib";
import {VaultsController} from "../../src/modules/vaults/vaults.controller";

/**
 * This class encapsulates all the test specific application functionality that is required.
 */
export class TestHelper {
  application: KangoJS;
  client: SuperAgentTest;

  constructor() {
    const serveSpaMiddleware = createServeSPAMiddleware({
      folderPath: "../../dashboard/build"
    });

    this.application = new KangoJS({
      dependencyOverrides: [
        {
          original: ConfigService,
          override: TestConfigService
        }
      ],
      controllers: [
        BaseController,
        AuthController,
        UsersController,
        VaultsController
      ],
      middleware: [
        serveSpaMiddleware
      ],
      authValidator: AuthValidator,
      bodyValidator: ClassValidator,
      queryValidator: ClassValidator,
      paramsValidator: ClassValidator
    });

    const expressApp = this.application.getApp();
    this.client = agent(expressApp)
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserAccessToken(user: UserDto): string {
    return this.getUserTokens(user).accessToken;
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserTokens(user: UserDto): TokenPair {
    const tokenService = this.application.dependencyContainer.useDependency(TokenService);
    return tokenService.createTokenPair(user);
  }

  /**
   * Reset the database to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.application.dependencyContainer.useDependency(DatabaseService);
    const sql = await databaseService.getSQL();

    // Because "on delete cascade" is present on all relationships
    // deleting users will automatically delete all content too.
    await sql`DELETE FROM users`;

    // Add all test data
    for (const user of testUsers) {
      // Add user
      await sql`
        INSERT INTO users(id, username, email, password_hash, encryption_secret, is_verified, created_at, updated_at) 
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.encryptionSecret}, ${user.isVerified}, ${user.createdAt}, ${user.updatedAt})
       `;

      // Add users vaults
      for (const vault of testData[user.id].vaults) {
        await sql`
        INSERT INTO vaults(id, name, description, created_at, updated_at, owner) 
        VALUES (${vault.id}, ${vault.name}, ${vault.description}, ${vault.createdAt}, ${vault.updatedAt}, ${vault.owner})
       `;
      }
    }
  }

  async killApplication() {
    // Clean up database and redis connections before exiting
    const cacheService = this.application.dependencyContainer.useDependency(CacheService);
    await cacheService.onKill();
    const databaseService = this.application.dependencyContainer.useDependency(DatabaseService);
    await databaseService.onKill();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the cache service to ensure things like refresh/access tokens aren't persisted
    const cacheService = this.application.dependencyContainer.useDependency(CacheService);
    await cacheService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}