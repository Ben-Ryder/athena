import {TokenPair, TokenService} from "../../src/services/token/token.service";
import {DatabaseService} from "../../src/services/database/database.service";
import {testUsers} from "../test-data";
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

    const expressApp = this.application.getApp();
    this.client = agent(expressApp)
  }

  /**
   * Return an API access token for the given user
   *
   * @param userId
   */
  getUserAccessToken(userId: string): string {
    const tokenService = this.application.dependencyContainer.useDependency(TokenService);
    return tokenService.createTokenPair(userId).accessToken;
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

    // Add Users
    for (const user of testUsers) {
      await sql`
        INSERT INTO users(id, username, email, password_hash, encryption_secret, is_verified, created_at, updated_at) 
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.encryptionSecret}, ${user.isVerified}, ${user.createdAt}, ${user.updatedAt})
       `;
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
  }

  async afterAll() {
    await this.killApplication();
  }
}